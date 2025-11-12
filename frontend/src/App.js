import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { LeaveApplicationsProvider } from "./context/LeaveApplicationsContext";
import { LeavePopupProvider } from "./context/LeavePopupContext"; 
import Login from "./pages/Login";
import "./globals.css";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SystemAdminDashboard from "./pages/SystemAdminDashboard";
import EstablishmentAdminDashboard from "./pages/EstbAdminDashboard";
import EstablishmentHeadDashboard from "./pages/EstbHeadDashboard";
import LeaveApproveMemberDashboard from "./pages/LeaveApproveDashboard";
import StandardMemberDashboard from "./pages/StandardDashboard";

import UserManagementPage, { CreateUserForm, UsersList } from "./components/UserManagement";
import { LeaveForwardingManagement } from "./components/LeaveForwardingManagement";
import ReportsTable, { ServiceMembersReport, IndividualMemberReport } from "./components/ReportsTable";
import { LeaveTypesManagement } from "./components/LeaveManagement";
import { MyLeaveHistory } from "./components/MyLeaveHistory";
import ApprovingOrRejectingLeaves from "./components/ApprovingOrRejectingLeaves";
import EstablishmentAdmin, { AssignEstbAdminForm, EstablishmentAdminsList } from "./components/EstablishmentAdmin";
import { EstablishmentUsersManagement } from "./components/EstablishmentUsersManagement";

import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Sonner } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LeaveCriteriaManagement } from "./components/LeaveCriteriaManagement";
import MyLeaveApplications from "./components/MyLeaveApplications";
import LeaveApplicationsManagement from "./components/LeaveApplicationsManagement";
import ActingMemberConfirmation from "./components/ActingMemberConfirmation";
import PendingLeaveRequests from "./components/PendingLeaveRequests";
import { MyLeaveReports } from "./components/MyLeaveReports";
import EstbLeaveRequestsOverview from "./components/EstbLeaveRequestsOverview";
import ComprehensiveLeaveReport from "./components/ComprehensiveLeaveReport";
import Notifications from "./components/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <LeavePopupProvider>
            <LeaveApplicationsProvider>
              <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/super-admin/*" element={<SuperAdminDashboard />} />
                <Route path="/apply/*" element={<LeaveApplicationsManagement />} />
                <Route path="/create-user/*" element={<CreateUserForm />} />
                <Route path="/users/*" element={<UserManagementPage />} />
                <Route path="/estb-admins/*" element={<EstablishmentAdmin />} />
                <Route path="/reports/*" element={<ComprehensiveLeaveReport />} />
                <Route path="/acting-confirmation/*" element={<ActingMemberConfirmation />} />

                <Route path="/my-leave-history/*" element={<MyLeaveApplications />} />
                <Route path="/pending-requests/*" element={<PendingLeaveRequests />} />
                <Route path="/my-reports/*" element={<MyLeaveReports />} />
                <Route path="/leave-overview/*" element={<EstbLeaveRequestsOverview />} />

                <Route path="/system-admin/*" element={<SystemAdminDashboard />} />
                <Route path="/leave-types/*" element={<LeaveTypesManagement />} />
                <Route path="/leave-criteria/*" element={<LeaveCriteriaManagement />} />

                <Route path="/establishment-admin/*" element={<EstablishmentAdminDashboard />} />
                <Route path="/role-assignment/*" element={<UserManagementPage />} />

                <Route path="/establishment-head/*" element={<EstablishmentHeadDashboard />} />

                <Route path="/leave-forwarding/*" element={<LeaveForwardingManagement />} />
                <Route path="/approve-reject-leaves/*" element={<ApprovingOrRejectingLeaves />} />
                <Route path="/leave-applications/*" element={<LeaveApproveMemberDashboard />} />

                <Route path="/standard-member/*" element={<StandardMemberDashboard />} />
                <Route path="/applications/*" element={<MyLeaveReports />} />
                <Route path="/history/*" element={<MyLeaveHistory />} />

                <Route path="/notifications" element={<Notifications />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </LeaveApplicationsProvider>
          </LeavePopupProvider>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
