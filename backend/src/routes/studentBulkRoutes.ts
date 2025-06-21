// src/routes/studentBulkRoutes.ts
import { Router } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const router = Router();

// Endpoint: POST /api/students/bulk-upload
router.post('/bulk-upload', async (req: any , res: any) => {
  const studentRecords: any[] = req.body; // Array of objects from CSV

  if (!Array.isArray(studentRecords) || studentRecords.length === 0) {
    return res.status(400).json({ message: 'Invalid data format or empty array.' });
  }

  const errors: { record: any; error: string }[] = [];
  const successfulUploads: { email: string; name: string; status: string }[] = [];

  for (const record of studentRecords) {
    try {
      // 1. Basic Validation
      if (!record.email || !record.name) {
        throw new Error('Missing required fields (email, name).');
      }

      // 2. Find or Create User
      let user = await prisma.user.findUnique({ where: { email: record.email } });

      if (!user) {
        // Generate a temporary password (HIGHLY IMPORTANT FOR SECURITY)
        const temporaryPassword = Math.random().toString(36).substring(2, 10); // Simple temp pass
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        user = await prisma.user.create({
          data: {
            email: record.email,
            password: hashedPassword,
            role: UserRole.STUDENT,
            isActive: true,
            // You might want to store the temporaryPassword somewhere secure
            // or send it via email/SMS immediately after user creation in a real app.
          },
        });
        console.log(`Created new user for student: ${record.email}`);
      } else if (user.role !== UserRole.STUDENT) {
        // Handle case where email exists but for a different role
        throw new Error(`Email ${record.email} exists with role ${user.role}. Cannot register as Student.`);
      }

      // 3. Resolve Class ID by name
      let classId: string | undefined;
      if (record.class_name) {
        const studentClass = await prisma.class.findUnique({ where: { name: record.class_name } });
        if (!studentClass) {
          console.warn(`Class "${record.class_name}" not found for student ${record.name}. Student will not be assigned to a class.`);
          classId = undefined; // Do not assign if class not found
        } else {
          classId = studentClass.id;
        }
      }

      // 4. Create Student Record
      const newStudent = await prisma.student.create({
        data: {
            studentId: '',
          userId: user.id,
          name: record.name,
          phone: record.phone || null,
          address: record.address || null,
          dateOfBirth: record.dateOfBirth ? new Date(record.dateOfBirth) : null,
          admissionDate: record.admissionDate ? new Date(record.admissionDate) : new Date(),
          classId: classId || null,
          branch: record.branch || null,

          // studentId is @unique @default(cuid()) so Prisma generates it
        },
      });

      // 5. Link Student to Parent (if parent_email provided)
      if (record.parent_email) {
        const parentUser = await prisma.user.findUnique({ where: { email: record.parent_email } });
        if (parentUser && parentUser.role === UserRole.PARENT) {
          const parent = await prisma.parent.findUnique({ where: { userId: parentUser.id } });
          if (parent) {
            await prisma.studentParent.create({
              data: {
                studentId: newStudent.id,
                parentId: parent.id,
              },
            });
            console.log(`Linked student ${newStudent.name} to parent ${parent.name}`);
          } else {
            console.warn(`Parent user found for ${record.parent_email} but no corresponding Parent profile.`);
          }
        } else {
          console.warn(`Parent with email ${record.parent_email} not found or is not a parent role.`);
        }
      }

      successfulUploads.push({ email: record.email, name: record.name, status: 'success' });

    } catch (e: any) {
      console.error(`Error processing student record (${record.email || record.name || JSON.stringify(record)}):`, e.message);
      errors.push({ record: record, error: e.message });
    }
  }

  if (errors.length > 0) {
    return res.status(207).json({ // 207 Multi-Status for partial success
      message: `${successfulUploads.length} student records uploaded successfully, ${errors.length} failed.`,
      successfulUploads,
      errors,
    });
  }

  return res.status(200).json({
    message: `Successfully uploaded ${successfulUploads.length} student records.`,
    count: successfulUploads.length,
  });
});

export default router;
