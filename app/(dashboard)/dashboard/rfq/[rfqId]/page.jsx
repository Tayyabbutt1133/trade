

const page = async ({params}) => {

    const rfqId = (await params).rfqId; 
  return (
    <div>{rfqId}</div>
  )
}

export default page