import { certificates } from "../../data/student/studentData";
import CertificateCard from "../../components/student/CertificateCard";

export default function CertificatesPage() {
  return (
    <div className="space-y-7">

      <div>
        <h2 className="text-2xl font-bold">
          Certificates
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Certificates earned from completed programs.
        </p>
      </div>


      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {certificates.map((certificate) => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
          />
        ))}

      </div>

    </div>
  );
}
