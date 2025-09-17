import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { clearAllUserErrors, logout } from "@/store/slices/userSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FolderGit,
  Home,
  LogOut,
  Package,
  Package2,
  Package2Icon,
  PanelLeft,
  PencilRuler,
  User,
  Users2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SideBarLink from "./components/SideBarLink";
import Dashboard from "./components/Dashboard";
import Account from "./components/Account";
import Invoices from "./components/Invoices";
import Clients from "./components/Clients";
import Orders from "./components/Orders";

function HomePage() {
  const [active, setActive] = useState("Dashboard");
  const { isAuthenticated, error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("User Logged Out!");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (!isAuthenticated) {
      navigateTo("/login");
    }
  }, [isAuthenticated, dispatch, error, navigateTo]);

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-16 flex-col border-r border-stone-200 bg-stone-100 sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 py-5">
            <Link className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-stone-200 transition">
              <Package className="h-6 w-6 text-stone-700 group-hover:scale-110 transition-all" />
              <span className="sr-only">Dashboard</span>
            </Link>
            <SideBarLink
              menu="Dashboard"
              icon={Home}
              active={active}
              setActive={setActive}
            />
            <SideBarLink
              menu="Invoices"
              icon={FolderGit}
              active={active}
              setActive={setActive}
            />
             <SideBarLink
              menu="Orders"
              icon={Package2Icon}
              active={active}
              setActive={setActive}
            />
               <SideBarLink
              menu="Clients"
              icon={Users2}
              active={active}
              setActive={setActive}
            />
       
            <SideBarLink
              menu="Account"
              icon={User}
              active={active}
              setActive={setActive}
            />
            
          </nav>

          {/* Logout Button */}
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5 border-t border-stone-200">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    onClick={handleLogout}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 hover:text-stone-800 hover:bg-stone-200 transition-colors md:h-8 md:w-8"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="sr-only">Logout</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col sm:ml-16 min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-stone-200 bg-stone-100 px-4 sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <button className="sm:hidden text-stone-700 hover:text-stone-900">
                  <PanelLeft className="w-5 h-5" />
                  <span className="sr-only">Toggle Menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs bg-stone-50">
                <nav className="grid gap-6 text-lg font-medium px-4 py-4">
                  <Link className="group flex h-10 w-10 items-center justify-center rounded-full bg-stone-300 text-white">
                    <Package2 className="h-5 w-5 group-hover:scale-110 transition-all" />
                    <span className="sr-only">Dashboard</span>
                  </Link>
                  <Link
                    to="#"
                    onClick={() => setActive("Dashboard")}
                    className={`${
                      active === "Dashboard"
                        ? "text-stone-900"
                        : "text-stone-600 hover:text-stone-900"
                    } flex items-center gap-4 px-2.5`}
                  >
                    <Home className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="#"
                    onClick={() => setActive("Orders")}
                    className={`${
                      active === "Orders"
                        ? "text-stone-900"
                        : "text-stone-600 hover:text-stone-900"
                    } flex items-center gap-4 px-2.5`}
                  >
                    <Home className="h-5 w-5" />
                    Orders
                  </Link>
                  <Link
                    to="#"
                    onClick={() => setActive("Add Project")}
                    className={`${
                      active === "Add Project"
                        ? "text-stone-900"
                        : "text-stone-600 hover:text-stone-900"
                    } flex items-center gap-4 px-2.5`}
                  >
                    <FolderGit className="h-5 w-5" />
                    Invoices
                  </Link>
                    <Link
                    to="#"
                    onClick={() => setActive("Clients")}
                    className={`${
                      active === "Clients"
                        ? "text-stone-900"
                        : "text-stone-600 hover:text-stone-900"
                    } flex items-center gap-4 px-2.5`}
                  >
                    <Users2 className="h-5 w-5" />
                    Clients
                  </Link>
                
                  <Link
                    to="#"
                    onClick={() => setActive("Account")}
                    className={`${
                      active === "Account"
                        ? "text-stone-900"
                        : "text-stone-600 hover:text-stone-900"
                    } flex items-center gap-4 px-2.5`}
                  >
                    <User className="h-5 w-5" />
                    Account
                  </Link>
                  <Link
                    to="#"
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-2.5 text-stone-600 hover:text-stone-900"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-4 ">
              {user?.avatar?.url && (
                <img
                  src={user.avatar.url}
                  alt="avatar"
                  className="w-10 h-10 rounded-full hidden sm:block"
                />
              )}
              <h1 className="text-xl md:text-2xl sm:text-xs font-semibold text-stone-800">
                Welcome Back, {user.username}
              </h1>
            </div>
          </header>

          {/* Dynamic Content */}
          <main className="flex-1 p-4 sm:p-6 min-w-0 bg-stone-50">
            {(() => {
              switch (active) {
                case "Dashboard":
                  return <Dashboard />;
                case "Account":
                  return <Account />;
                case "Invoices":
                  return <Invoices />;
                case "Clients":
                  return <Clients />;
                case "Orders":
                  return <Orders/>
                default:
                  return null;
              }
            })()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
