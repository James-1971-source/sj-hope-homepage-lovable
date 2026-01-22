import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Loader2, Eye } from "lucide-react";

interface DonationInquiry {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  donation_type: string;
  message: string | null;
  created_at: string;
}

export default function DonationsAdmin() {
  const [inquiries, setInquiries] = useState<DonationInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<DonationInquiry | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("donation_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error(error);
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const { error } = await supabase.from("donation_inquiries").delete().eq("id", id);

    if (error) {
      toast.error("삭제 중 오류가 발생했습니다.");
      console.error(error);
    } else {
      toast.success("문의가 삭제되었습니다.");
      fetchInquiries();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">후원 문의 관리</h1>
          <p className="text-muted-foreground mt-1">후원 신청 내역을 확인합니다.</p>
        </div>

        {/* Table */}
        <div className="bg-background rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>후원유형</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead className="w-32">신청일</TableHead>
                <TableHead className="w-24">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    후원 문의가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{inquiry.donation_type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {inquiry.phone || inquiry.email || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(inquiry.created_at).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedInquiry(inquiry)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(inquiry.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>후원 문의 상세</DialogTitle>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">이름</p>
                    <p className="font-medium">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">후원 유형</p>
                    <p className="font-medium">{selectedInquiry.donation_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">연락처</p>
                    <p className="font-medium">{selectedInquiry.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">이메일</p>
                    <p className="font-medium">{selectedInquiry.email || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">메시지</p>
                  <p className="font-medium whitespace-pre-wrap">{selectedInquiry.message || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">신청일</p>
                  <p className="font-medium">
                    {new Date(selectedInquiry.created_at).toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
