import { EmailForm } from "../components/EmailForm"; 


const EmailFormPage = async ({ params }) => {
  const emailId = (await params).emailId;
  const isNewEmail = emailId === "new";
  const emailIdData = new FormData()
  let emailData
  if (!isNewEmail) {
    emailIdData.append("regid", emailId)
    const res = isNewEmail ? null : await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/emailtemplate/", {
      method: "POST",
      body: emailIdData
    })
    const data = (await res.json()).EmailTemplate[0]
    emailData = data
  }
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {isNewEmail ? "Add Email Template" : "Edit Email Template"}
      </h1>
      <div>
        <EmailForm emailId={emailId} initialData={emailData}/>
      </div>
    </div>
  );
};

export default EmailFormPage;
