import { useGetClasses } from "@/hooks/class";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function AdminClass() {
  const { data: classes, isError, isPending } = useGetClasses();

  if (isPending) return <p>Loading classes...</p>;
  if (isError) return <p>Error loading classes.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Classes Management</h2>
        <p className="text-gray-600">View and manage class information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes?.map((cls) => {
          const className = `Grade ${cls.grade} - ${cls.section}`;
          const studentCount = cls.students?.length ?? 0;
          const teacherName = cls.teachers?.[0]?.name ?? "No teacher assigned";

          return (
            <Card key={cls.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{className}</span>
                  <Badge variant="outline">{studentCount} students</Badge>
                </CardTitle>
                <CardDescription>Class Teacher: {teacherName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>Capacity: {cls.capacity ?? "N/A"}</p>
                    <p>Students: {studentCount}</p>
                    <p>Teacher: {teacherName}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
