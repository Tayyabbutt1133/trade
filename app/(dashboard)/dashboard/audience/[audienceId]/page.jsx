import { AudienceForm } from "../components/AudienceForm";

const AudienceFormPage = async ({ params }) => {
  const audienceId = (await params).audienceId;
  const isNewAudience = audienceId === "new";

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {isNewAudience ? "Add New Audience" : "Edit Audience"}
      </h1>
      <div>
        <AudienceForm />
      </div>
    </div>
  );
};

export default AudienceFormPage;