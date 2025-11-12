import { 
  Users, 
  UserPlus, 
  Building2, 
  FileText, 
  Settings, 
  BarChart3,
  Calendar,
  Shield,
  BellDot,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "../components/ui/sidebar";  
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

export function AdminSidebar({ userRole, userName = "Admin User" }) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const getNavCls = ({ isActive }) =>
    isActive
      ? "bg-primary text-primary-foreground font-medium"
      : "hover:bg-accent hover:text-accent-foreground"; 

  const superAdminItems = [
    { title: "Apply for Leave", url: "/apply", icon: Calendar },
    { title: "All Users", url: "/users", icon: Users },
    { title: "Establishment Admins", url: "/estb-admins", icon: Building2 },
    { title: "Reports", url: "/reports", icon: FileText },
    { title: "Leave History", url: "/history", icon: Users },
    { title: "Notifications", url:"/notifications", icon: BellDot}

  ];

  const systemAdminItems = [
    { title: "Apply for Leave", url: "/apply", icon: Calendar },
    { title: "Leave Types", url: "/leave-types", icon: Calendar },
    { title: "Leave Criteria", url: "/leave-criteria", icon: Settings },
    { title: "Reports", url: "/reports", icon: FileText },
    { title: "Leave History", url: "/history", icon: Users },
    { title: "Notifications", url:"/notifications", icon: BellDot}


  ];

  const establishmentAdminItems = [ 
    { title: "Apply for Leave", url: "/apply", icon: Calendar },
    { title: "Users", url: "/users", icon: Users },
    { title: "Reports", url: "/reports", icon: FileText },
    { title: "Leave History", url: "/history", icon: Users },
    { title: "Notifications", url:"/notifications", icon: BellDot}


  ];

  const establishmentHeadItems = [    
    { title: "Leave Application", url: "/leave-applications", icon: Calendar },
    { title: "Leave Forwarding", url: "/leave-forwarding", icon: FileText },
    { title: "Approving/Rejecting Leaves", url: "/approving-rejecting-leaves", icon: FileText },
    { title: "Reports", url: "/reports", icon: FileText },
    { title: "Leave History", url: "/history", icon: Users },
    { title: "Notifications", url:"/notifications", icon: BellDot}


  ];

  

  const standardMemberItems = [
    { title: "Apply for Leave", url: "/apply", icon: Calendar },
    { title: "Leave History", url: "/history", icon: Users },
    { title: "Notifications", url:"/notifications", icon: BellDot}

  ];

  const getMenuItems = () => {
    switch (userRole) {
      case "super_admin":
        return superAdminItems;
      case "system_admin":
        return systemAdminItems;
      case "establishment_admin": 
        return establishmentAdminItems;
      case "establishment_head":
        return establishmentHeadItems;
      case "standard_member":
        return standardMemberItems;
      default:
        return standardMemberItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          {!collapsed && (
            <>
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h2 className="font-semibold text-sm">Leave Management</h2>
                <p className="text-xs text-muted-foreground">
                  {userRole === "super_admin" && "Super Admin"}
                  {userRole === "system_admin" && "System Admin"}
                  {userRole === "establishment_admin" && "Establishment Admin"}
                  {userRole === "establishment_head" && "Establishment Head"}
                  {userRole === "standard_member" && "Standard Member"}
                </p>
              </div>
            </>
          )}
          {collapsed && <Shield className="h-6 w-6 text-primary mx-auto" />}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent >
            <SidebarMenu className="space-y-2" align="center"  >
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        
      </SidebarFooter>
    </Sidebar>
  );
}

export {Sidebar, SidebarMenuButton} 