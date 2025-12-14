import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle  } from "../components/ui/card";
import { Shield, Users, Settings, Building2, UserCheck, Calendar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg- gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Shield className="h-16 w-16 text-primary" />  
          </div>
          <h1 className="text-4xl font-bold text-foreground">Leave Management System</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional administrative portal for managing leave requests, users and system configuration
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/super-admin')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Super Admin Portal</CardTitle>
              <CardDescription>
                Complete system administration with user management and establishment oversight
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
            
              <ul className="space-y-2" align="center" >
                <li>Create and manage users</li>
                <li>Assign establishment admins</li>
                <li>Generate comprehensive reports</li>
                <li>Full system oversight</li>
              </ul>
              <Button className="w-full mt-4" align="center">
                Access Super Admin
              </Button>
            </CardContent> 
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/system-admin')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>System Admin Portal</CardTitle>
              <CardDescription>
                Configure leave types, criteria, and manage service member data
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
            
              <ul className="space-y-2" align="center" >

                <li>Manage leave types</li>
                <li>Configure leave criteria</li>
                <li>View service members</li>
                <li>Generate reports</li>
              </ul>
              <Button className="w-full mt-4" align="center">
                Access System Admin
              </Button>
            </CardContent> 
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/establishment-admin')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Establishment Admin Portal</CardTitle>
              <CardDescription>
                Manage establishment users and role assignments
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
            
              <ul className="space-y-2" align="center" >

                <li>Manage establishment users</li>
                <li>Assign user roles</li>
                <li>View establishment reports</li>
                <li>User administration</li>
              </ul>
              <Button className="w-full mt-4" align="center">
                Access Establishment Admin
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/establishment-head')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <UserCheck className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Establishment Head & Leave Approve Member Portal</CardTitle>
              <CardDescription>
                Review and manage leave applications and forwarding
                <p>Establsihement Head has the authority to take final decision on approving/rejecting leaves</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
      
              <ul className="space-y-2" align="center" >

                <li>Review leave applications</li>
                <li>Forward leave requests</li>
                <li>Generate reports</li>
                <li>Application oversight</li>
              </ul>
              <Button className="w-full mt-4" align="center">
                Access Establishment Head
              </Button>
            </CardContent>
          </Card>

          

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/standard-member')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Standard Member Portal</CardTitle>
              <CardDescription>
                Apply for leave, view history, and track applications
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              
              <ul className="space-y-2" align="center" >
                <li>Apply for leave</li>
                <li>View leave history</li>
                <li>Track application status</li>
                <li>Generate personal reports</li>
              </ul>
              <Button className="w-full mt-4">
                Access Standard Member
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;