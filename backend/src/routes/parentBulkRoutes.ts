// src/routes/parentBulkRoutes.ts
import { Router } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const router = Router();

// Endpoint: POST /api/parents/bulk-upload
router.post('/bulk-upload', async (req: any, res: any) => {
  const parentRecords: any[] = req.body;

  if (!Array.isArray(parentRecords) || parentRecords.length === 0) {
    return res.status(400).json({ message: 'Invalid data format or empty array.' });
  }

  const errors: { record: any; error: string }[] = [];
  const successfulUploads: { email: string; name: string; status: string }[] = [];

  for (const record of parentRecords) {
    try {
      // 1. Basic Validation
      if (!record.email || !record.name) {
        throw new Error('Missing required fields (email, name).');
      }

      // 2. Find or Create User
      let user = await prisma.user.findUnique({ where: { email: record.email } });

      if (!user) {
        const temporaryPassword = Math.random().toString(36).substring(2, 10);
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        user = await prisma.user.create({
          data: {
            email: record.email,
            password: hashedPassword,
            role: UserRole.PARENT, // Assign correct role
            isActive: true,
          },
        });
        console.log(`Created new user for parent: ${record.email}`);
      } else if (user.role !== UserRole.PARENT) {
        throw new Error(`Email ${record.email} exists with role ${user.role}. Cannot register as Parent.`);
      }

      // 3. Create Parent Record
      await prisma.parent.create({
        data: {
          userId: user.id, // Link to the User
          name: record.name,
          phone: record.phone || null,
          address: record.address || null,
          occupation: record.occupation || null,
          relationship: record.relationship || null,
        },
      });

      successfulUploads.push({ email: record.email, name: record.name, status: 'success' });

    } catch (e: any) {
      console.error(`Error processing parent record (${record.email || record.name || JSON.stringify(record)}):`, e.message);
      errors.push({ record: record, error: e.message });
    }
  }

  if (errors.length > 0) {
    return res.status(207).json({
      message: `${successfulUploads.length} parent records uploaded successfully, ${errors.length} failed.`,
      successfulUploads,
      errors,
    });
  }

  return res.status(200).json({
    message: `Successfully uploaded ${successfulUploads.length} parent records.`,
    count: successfulUploads.length,
  });
});

export default router;
