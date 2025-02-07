import { EmailForm } from "../components/EmailForm"; 


const EmailFormPage = async ({ params }) => {
  const emailId = (await params).emailId;
  const isNewEmail = emailId === "new";

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {isNewEmail ? "Add Email Template" : "Edit Email Template"}
      </h1>
      <div>
        <EmailForm />
      </div>
    </div>
  );
};

export default EmailFormPage;
