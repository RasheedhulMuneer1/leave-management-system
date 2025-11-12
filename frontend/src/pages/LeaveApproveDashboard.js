// import { Routes, Route } from "react-router-dom";
// import { SidebarProvider, SidebarInset } from "../components/ui/sidebar";
// import { AdminSidebar } from "../components/AdminSidebar";
// import { DashboardHeader } from "../components/DashboardHeader";
// import { DashboardStats } from "../components/DashboardStats";
// import LeaveApplicationsManagement from "../components/LeaveApplicationsManagement";
// import { ServiceMembersReport } from "../components/ReportsTable";
// import DashboardLayout from "../components/DashboardLayout";

// function LeaveApproveMemberHome() {
//   return (
//     <div className="space-y-6">
//       <DashboardStats userRole="leave_approve_member" />
      
//       <div className="grid gap-6 md:grid-cols-2">
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">Quick Actions</h3>
//           <div className="grid gap-3">
//             <button className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors">
//               <h4 className="font-medium">Approve Leave</h4>
//               <p className="text-sm text-muted-foreground">Review and approve pending leave applications</p>
//             </button>
//             <button className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors">
//               <h4 className="font-medium">View Applications</h4>
//               <p className="text-sm text-muted-foreground">View all submitted leave applications</p>
//             </button>
//           </div>
//         </div>
        
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">Pending Actions</h3>
//           <div className="space-y-3">
//             <div className="p-3 border-l-4 border-warning bg-muted/50">
//               <p className="text-sm font-medium">5 Applications Pending</p>
//               <p className="text-xs text-muted-foreground">Requires your approval</p>
//             </div>
//             <div className="p-3 border-l-4 border-primary bg-muted/50">
//               <p className="text-sm font-medium">3 Processed Today</p>
//               <p className="text-xs text-muted-foreground">Successfully approved/rejected</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function LeaveApplicationsPage() {
//   return <LeaveApplicationsManagement />;
// }

// function ReportsPage() {
//   return <ServiceMembersReport />;
// }

// export default function LeaveApproveMemberDashboard() {
//   return (
//     <SidebarProvider>
//       {/* <div className="flex min-h-screen w-full"> */}
//       <div className="space-y-2" align="center" >
//         <AdminSidebar userRole="leave_approve_member" userName="Leave Approve Member" className="space-y-2" align="center"  />
//         <SidebarInset>
//           <Routes>
//             <Route path="/" element={
//               <>
//                 <DashboardHeader className="space-y-2" align="center"  title="Leave Approve Member Dashboard" subtitle="Review and approve leave applications" />
//                 {/* <main className="flex-1 p-6"> */}
//                 <main className="space-y-2" align="center">
//                   <LeaveApproveMemberHome />
//                 </main>
//               </>
//             } />
//             <Route path="/leave-applications" element={
//               <>
//                 <DashboardHeader title="Leave Applications" subtitle="Manage leave approval requests" showSearch />
//                 <main className="flex-1 p-6">
//                   <LeaveApplicationsPage />
//                 </main>
//               </>
//             } />
//             <Route path="/reports" element={
//               <>
//                 <DashboardHeader title="Reports" subtitle="View leave reports and analytics" />
//                 <main className="flex-1 p-6">
//                   <ReportsPage />
//                 </main>
//               </>
//             } />
//           </Routes>
//         </SidebarInset>
//       </div>
//     </SidebarProvider>
//   );
// }

