import { PrismaClient, UserRole, TeacherStatus } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clean slate (optional)
  await prisma.assignment.deleteMany();
  await prisma.classSubject.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.class.deleteMany();
  await prisma.fee.deleteMany();
  await prisma.studentParent.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.event.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.user.deleteMany();

  // 1. Users with roles
  const adminU = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "securehash",
      role: UserRole.ADMIN,
      admin: { create: { name: "Admin One" } },
    },
  });

  const teacherU = await prisma.user.create({
    data: {
      email: "teacher@example.com",
      password: "securehash",
      role: UserRole.TEACHER,
      teacher: {
        create: {
          teacherId: "T-001",
          name: "John Teacher",
          phone: "1234567890",
          address: "123 Teacher St",
          dateOfJoining: new Date("2020-01-01"),
          qualification: "M.Ed",
          status: TeacherStatus.ACTIVE,
          subject: "General",
          branch: "Main",
        },
      },
    },
  });

  const studentU = await prisma.user.create({
    data: {
      email: "student@example.com",
      password: "securehash",
      role: UserRole.STUDENT,
      student: {
        create: {
          studentId: "S-001",
          name: "Jane Student",
          phone: "0987654321",
          address: "456 Elm St",
          dateOfBirth: new Date("2010-05-01"),
          admissionDate: new Date("2025-06-01"),
          branch: "Main",
        },
      },
    },
  });

  const parentU = await prisma.user.create({
    data: {
      email: "parent@example.com",
      password: "securehash",
      role: UserRole.PARENT,
      parent: {
        create: {
          name: "Parent One",
          phone: "1122334455",
          address: "456 Elm St",
          occupation: "Engineer",
          relationship: "Mother",
        },
      },
    },
  });

  // 2. Link student and parent
  const student = await prisma.student.findUnique({ where: { userId: studentU.id } });
  const parent = await prisma.parent.findUnique({ where: { userId: parentU.id } });
  if (student && parent) {
    await prisma.studentParent.create({
      data: { studentId: student.id, parentId: parent.id },
    });
  }

  // 3. Branch
  const branch = await prisma.branch.create({
    data: { name: "Main", students: 1, teachers: 1, classes: 0 },
  });

  // 4. Class
  const cls = await prisma.class.create({
    data: {
      name: "Grade 1-A",
      grade: 1,
      section: "A",
      capacity: 25,
    },
  });

  // assign student to class
  if (student) {
    await prisma.student.update({ where: { id: student.id }, data: { classId: cls.id } });
  }

  // assign teacher to class
  const teacher = await prisma.teacher.findUnique({ where: { userId: teacherU.id } });
  if (teacher) {
    await prisma.class.update({
      where: { id: cls.id },
      data: { teachers: { connect: { id: teacher.id } } },
    });
  }

  // 5. Subjects
  const subject1 = await prisma.subject.create({
    data: {
      name: "Mathematics",
      code: "MATH101",
      description: "Basic Math",
      credits: 4,
      teacher: { connect: { id: teacher!.id } },
    },
  });

  const subject2 = await prisma.subject.create({
    data: {
      name: "Science",
      code: "SCI101",
      description: "Basic Science",
      credits: 4,
      teacher: { connect: { id: teacher!.id } },
    },
  });

  // 6. ClassSubject linking
  for (const subj of [subject1, subject2]) {
    await prisma.classSubject.create({
      data: { classId: cls.id, subjectId: subj.id },
    });
  }

  // 7. Fee for student
  if (student) {
    await prisma.fee.create({
      data: {
        studentId: student.id,
        amount: 2000,
        status: "PAID",
        date: new Date(),
      },
    });
  }

  // 8. Assignments
  for (const [idx, subj] of [subject1, subject2].entries()) {
    await prisma.assignment.create({
      data: {
        name: `Assignment for ${subj.name}`,
        classId: cls.id,
        subjectId: subj.id,
        teacherId: teacher!.id,
      },
    });
  }

  // 9. Event
  await prisma.event.create({
    data: { title: "Annual Day", date: new Date("2025-12-15"), type: "Celebration" },
  });

  // 10. Lead
  await prisma.lead.create({
    data: {
      studentName: "New Prospect",
      parentName: "Prospect Parent",
      contactEmail: "lead@example.com",
      contactPhone: "6677889900",
      desiredClass: "Grade 2",
    },
  });

  // 11. Update branch counts
  await prisma.branch.update({
    where: { id: branch.id },
    data: { classes: { increment: 1 } },
  });

  console.log("✅ Done seeding database.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
