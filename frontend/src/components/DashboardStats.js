import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, Building2, Calendar, FileText, TrendingUp, TrendingDown } from "lucide-react";

function StatCard({ title, value, description, icon, trend }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center mt-2">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-xs ml-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats({ userRole, stats }) {


  const systemAdminStats = [
    {
      title: "Leave Types",
      value: 12,
      description: "Configured leave types",
      icon: <Calendar className="h-4 w-4" />
    },
    {
      title: "Service Members",
      value: 892,
      description: "Total service members",
      icon: <Users className="h-4 w-4" />,
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Active Leaves",
      value: 67,
      description: "Currently on leave",
      icon: <Calendar className="h-4 w-4" />,
      trend: { value: 15, isPositive: true }
    },
    {
      title: "Monthly Reports",
      value: 28,
      description: "Generated this month",
      icon: <FileText className="h-4 w-4" />,
      trend: { value: 18, isPositive: true }
    }
  ];

  const establishmentAdminStats = [
    {
      title: "Total Users",
      value: 45,
      description: "In establishment",
      icon: <Users className="h-4 w-4" />,
      trend: { value: 3, isPositive: true }
    },
    {
      title: "Role Assignments",
      value: 12,
      description: "This month",
      icon: <Building2 className="h-4 w-4" />,
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Active Members",
      value: 42,
      description: "Currently active",
      icon: <Users className="h-4 w-4" />
    },
    {
      title: "Reports",
      value: 18,
      description: "Generated",
      icon: <FileText className="h-4 w-4" />
    }
  ];



  const establishmentHeadStats = [
    {
      title: "Pending Approvals",
      value: 8,
      description: "Awaiting decision",
      icon: <Calendar className="h-4 w-4" />,
      trend: { value: 2, isPositive: false }
    },
    {
      title: "Approved Today",
      value: 15,
      description: "Applications processed",
      icon: <Calendar className="h-4 w-4" />,
      trend: { value: 20, isPositive: true }
    },
    {
      title: "Forwarded",
      value: 3,
      description: "To external orgs",
      icon: <FileText className="h-4 w-4" />
    },
    {
      title: "Team Members",
      value: 67,
      description: "In establishment",
      icon: <Users className="h-4 w-4" />
    }
  ];

  const leaveApproveMemberStats = [
    {
      title: "Pending Reviews",
      value: 5,
      description: "Awaiting approval",
      icon: <Calendar className="h-4 w-4" />,
      trend: { value: 1, isPositive: false }
    },
    {
      title: "Processed Today",
      value: 3,
      description: "Applications handled",
      icon: <Calendar className="h-4 w-4" />,
      trend: { value: 50, isPositive: true }
    },
    {
      title: "This Month",
      value: 42,
      description: "Total processed",
      icon: <FileText className="h-4 w-4" />
    },
    {
      title: "Approval Rate",
      value: "89%",
      description: "Success rate",
      icon: <TrendingUp className="h-4 w-4" />
    }
  ];

  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    </div>
  );
}
