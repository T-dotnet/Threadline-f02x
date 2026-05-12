import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { ClientListScreen } from "./ClientListScreen";
import { PatientListWorkspace } from "./PatientListWorkspace";
import { MainSessionListWorkspace } from "./MainSessionListWorkspace";
import { ResourcesWorkspace } from "./ResourcesWorkspace";
import { UsersWorkspace } from "./UsersWorkspace";
import { AssessmentListScreen } from "./AssessmentListScreen";
import { MainAssessmentListWorkspace } from "./MainAssessmentListWorkspace";
import { MainDocumentListWorkspace } from "./MainDocumentListWorkspace";

interface ThreadlineModuleProps {
  onGuidelinesClick?: () => void;
  type?: 'clients' | 'patients' | 'sessions' | 'assessments' | 'documents' | 'resources' | 'users';
}

export function ThreadlineModule({ onGuidelinesClick, type = 'clients' }: ThreadlineModuleProps) {
  const navigate = useNavigate();

  const getIndexElement = () => {
    switch (type) {
      case 'patients': return <PatientListWorkspace />;
      case 'sessions': return <MainSessionListWorkspace />;
      case 'assessments': return <MainAssessmentListWorkspace />;
      case 'documents': return <MainDocumentListWorkspace />;
      case 'resources': return <ResourcesWorkspace />;
      case 'users': return <UsersWorkspace />;
      default: return <ClientListScreen onSelectClient={(id) => navigate(`/clients/${id}`)} />;
    }
  };

  return (
    <div className="bg-workspace-bg min-h-screen">
      <Routes>
        <Route index element={getIndexElement()} />
        <Route path=":clientId/*" element={<AssessmentListScreenWrapper onBack={() => navigate('/clients')} />} />
      </Routes>
    </div>
  );
}

function AssessmentListScreenWrapper({ onBack }: { onBack: () => void }) {
  const { clientId } = useParams();
  return <AssessmentListScreen clientId={clientId || "125566"} onBack={onBack} />;
}
