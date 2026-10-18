import { certificates } from "../../data/student/studentData";
import CertificateCard from "../../components/student/CertificateCard";

export default function CertificatesPage() {
  return (
    <div className="space-y-7">




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
