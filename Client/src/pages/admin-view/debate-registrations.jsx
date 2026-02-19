import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mic2,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Users,
  Phone,
  Mail,
  AtSign,
  Calendar,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import { format, isValid } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function AdminDebateRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const limit = 20;

  const fetchRegistrations = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/debate/registrations?page=${page}&limit=${limit}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data);
        setTotal(data.total);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        toast.error(data.message || "Failed to load registrations.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/debate/delete/${selectedId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Registration deleted successfully");
        fetchRegistrations(currentPage);
      } else {
        toast.error(data.message || "Failed to delete registration");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedId(null);
    }
  };

  useEffect(() => {
    fetchRegistrations(1);
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isValid(d) ? format(d, "dd MMM yyyy, HH:mm") : "N/A";
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Mic2 className="w-6 h-6 text-orange-500" />
            Debate Registrations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            All participants who registered for the Afkit Debate Campaign
          </p>
        </div>
        <button
          onClick={() => fetchRegistrations(currentPage)}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-2 rounded transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Registrations
            </CardTitle>
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-gray-900">{total}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-16 text-gray-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4 text-orange-400" />
                <p className="text-sm font-medium animate-pulse">
                  Loading registrations...
                </p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-gray-400">
                <Mic2 className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">No registrations yet.</p>
              </div>
            ) : (
              <>
                {/* Mobile Cards */}
                <div className="sm:hidden divide-y divide-gray-100">
                  {registrations.map((reg) => (
                    <div key={reg._id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <p className="font-black text-gray-900 text-base">{reg.fullName}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-orange-50 text-orange-600 font-bold px-2 py-1 rounded-full uppercase border border-orange-100">
                            Registered
                          </span>
                          <button
                            onClick={() => handleDeleteClick(reg._id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <p className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="w-3.5 h-3.5" /> {reg.phone}
                        </p>
                        <p className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail className="w-3.5 h-3.5" /> {reg.email}
                        </p>
                        {reg.tikTokHandle && (
                          <p className="flex items-center gap-2 text-xs text-gray-500">
                            <AtSign className="w-3.5 h-3.5 text-black" />{" "}
                            <span className="text-gray-800 font-semibold">TikTok:</span>{" "}
                            {reg.tikTokHandle}
                          </p>
                        )}
                        {reg.instagramHandle && (
                          <p className="flex items-center gap-2 text-xs text-gray-500">
                            <AtSign className="w-3.5 h-3.5 text-pink-500" />{" "}
                            <span className="text-gray-800 font-semibold">Instagram:</span>{" "}
                            {reg.instagramHandle}
                          </p>
                        )}
                        <p className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />{" "}
                          {formatDate(reg.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">#</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                          Full Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                          Phone
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                          TikTok
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                          Instagram
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                          Date
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {registrations.map((reg, index) => (
                        <tr
                          key={reg._id}
                          className="hover:bg-orange-50/30 transition-colors group"
                        >
                          <td className="px-6 py-4 text-xs font-bold text-gray-400">
                            {(currentPage - 1) * limit + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-black text-gray-900">
                              {reg.fullName}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-bold text-gray-600">
                              {reg.phone}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-medium text-gray-600">
                              {reg.email}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs text-gray-500">
                              {reg.tikTokHandle || "—"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs text-gray-500">
                              {reg.instagramHandle || "—"}
                            </span>
                          </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs text-gray-400">
                              {formatDate(reg.createdAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleDeleteClick(reg._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 group-hover:scale-110"
                              title="Delete Registration"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                    Page {currentPage} of {totalPages || 1}
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => fetchRegistrations(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-black bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl transition-all disabled:opacity-30 shadow-sm border border-gray-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      PREV
                    </button>
                    <div className="sm:hidden text-xs font-black text-gray-700 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                      {currentPage} / {totalPages || 1}
                    </div>
                    <button
                      onClick={() => fetchRegistrations(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0 || isLoading}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-black bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl transition-all disabled:opacity-30 shadow-sm border border-gray-200"
                    >
                      NEXT
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash className="w-5 h-5" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this debate registration? This action
              cannot be undone and the participant info will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminDebateRegistrations;
