import EventForm from './event_form'
function Calendar() {
  return (
    <main className="container px-0">
      <EventForm onSubmit={()=>{
        console.log("hello you have submited an event")
      }} />
    </main>
  )
}
export default Calendar