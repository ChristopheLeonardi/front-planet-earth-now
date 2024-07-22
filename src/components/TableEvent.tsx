import { useState, useEffect } from "react"

const EventCard = (event:any) => {
  const dates = event["Date fin"] === "" 
  ? `le ${event["Date début"]}`
  : `du ${event["Date début"]} au ${event["Date fin"]}`


  return (
    <div className={`card ${event["PEN présents"] != "" ? "pen-present" : ""}`}>
      <>{console.log(event)}</>
      <h3>{event["Evènement"]}</h3>
      <p className="lieu">{event["Ville"]}</p>
      <p className="date">{dates}</p>
      <p className="type">{event["Type"]}</p>
      <a href={event["Lien"]} target="_blank" title="Aller sur la page de l'évènement">Lien Vers l'évènement</a>
    </div>
  )
}

const TableEvent = (content:any) => {
  const [data, setData] = useState<any[]>([])
  useEffect(() => {
    setData(content.content)
  }, [])
  return (
    <section className="event-container">
      {data && data.map( (event:any) => {
        return EventCard(event)
      })}
    </section>
  )
}

export default TableEvent