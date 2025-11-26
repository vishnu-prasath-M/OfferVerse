import { redirect } from "next/navigation";

export default function FlashDealsPage() {
  // For now, reuse /deals with the flash filter enabled via query string
  redirect("/deals?flash=true");
}
