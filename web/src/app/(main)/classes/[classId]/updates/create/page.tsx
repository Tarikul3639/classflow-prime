// // updates/create/page.tsx
// "use client";

// import React, { useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { UpdateEditorHeader } from "./_components/UpdateEditorHeader";
// import { UpdateForm } from "./_components/UpdateForm";
// import { UpdatePreview } from "./_components/UpdatePreview";
// import { ProTip } from "./_components/ProTip";
// import { useAppDispatch } from "@/redux/hooks";
// import { createClassUpdate } from "@/redux/slices/classes/thunks/create-class-update.thunk";
// import type { CreateUpdateFormData } from "@/types/update.types";

// export default function CreateUpdatePage() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const params = useParams();
//   const classId = params.classId as string;

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [form, setForm] = useState<CreateUpdateFormData>({
//     type: "announcement",
//     title: "",
//     description: "",
//     date: "",
//     time: "",
//     attachments: [],
//   });

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       await dispatch(createClassUpdate({ classId, data: form })).unwrap();

//       router.push(`/classes/${classId}/updates`);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-slate-50">
//       <UpdateEditorHeader
//         classId={classId}
//         isNew={true}
//         isLoading={isLoading}
//         error={error}
//         onSubmit={handleSubmit}
//       />

//       <main className="flex-1 overflow-y-auto p-2 md:p-4 lg:p-6">
//         <div className="mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
//           <div className="xl:col-span-7">
//             <UpdateForm form={form} setForm={setForm} />
//           </div>

//           <div className="xl:col-span-5">
//             <div className="sticky top-24 xl:top-0 space-y-4">
//               <UpdatePreview form={form} />
//               <ProTip />
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
