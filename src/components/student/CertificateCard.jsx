import {
  Award,
  Download,
} from "lucide-react";

export default function CertificateCard({
  certificate,
}) {
  const downloadCertificate = () => {
    const content = `
CODEFACULTY CERTIFICATE

Certificate ID: ${certificate.id}
Course: ${certificate.title}
Student: Aditya Sharma
Trainer: ${certificate.trainer}
Issue Date: ${certificate.issueDate}
`;

    const blob = new Blob(
      [content],
      {
        type: "text/plain",
      }
    );

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${certificate.id}.txt`;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        <Award size={22} />
      </div>

      <h3 className="mt-5 font-bold text-slate-900">
        {certificate.title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Trainer: {certificate.trainer}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Issued: {certificate.issueDate}
      </p>

      <p className="mt-2 text-xs text-slate-400">
        {certificate.id}
      </p>


      <button
        type="button"
        onClick={downloadCertificate}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-50 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-600 hover:text-white"
      >
        <Download size={16} />
        Download Certificate
      </button>

    </article>
  );
}
