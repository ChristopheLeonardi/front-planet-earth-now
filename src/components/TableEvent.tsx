import { useEffect, useState } from "react"
import React from "react"
import "./tableEvent.css"

const isWellFormatted = (str:string) => {
  const invalidChar = ["", "/"]
  var result = true
  invalidChar.map((char:string) => {
    if (str === char){
      result = false
    }
  })
  return result
}

const EventCard = ({event}:any) => {

  const [dates, setDates] = useState("")
  const [region, setRegion] = useState("")
  const [ville, Ville] = useState("")
  const [title, setTitle] = useState("")

  useEffect(() => {

    const dates = event["Date fin"] === "" 
    ? `${event["Date début"].replace(/\/20/mg, "/").replace(/\//mg, ":")}`
    : `${event["Date début"].replace(/\/20/mg, "/").replace(/\//mg, ":")}\n${event["Date fin"].replace(/\/20/mg, "/").replace(/\//mg, ":")}`
    setDates(dates)

    const regionString = event["Région"] === "" 
    ? event["Ville"]
    : event["Région"] + (event["Ville"] ? " \n" + event["Ville"] : "")
    /* setRegionString(regionString) */
    const maxLength = 20

    const region = event["Région"].length > maxLength ? event["Région"].substring(0, maxLength) : event["Région"]
    setRegion(region)
    const windowWidth = window.innerWidth;
    let title; // Declare title variable outside of the conditional blocks
    if (windowWidth < 425) {
      title = event["Evènement"].length > maxLength ? event["Evènement"].substring(0, maxLength) + "..." : event["Evènement"];
    } else {
      title = event["Evènement"];
    }
    
    setTitle(title);
    

  }, [])

  return (
    <div className={`card ${event['Type'].replace(/\s/gm, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()} ${event["PEN présents"] != "" ? "pen-present" : ""}`}>
      <a className="title" href={event["Lien"]} target="_blank" title="Aller sur la page de l'évènement">
          <div className="divider">
            <div className="date">
              {event["Date début"] && <p className="date-event">{event["Date début"].replace(/\//mg, ".")}</p>}
              {event["Date fin"] && <p className="date-event">{event["Date fin"].replace(/\//mg, ".")}</p>}
            </div>
            <div className="title">
            <p className={`type-event `}>{event["Type"] && isWellFormatted(event["Type"])  && (`${event["Type"]}`)}</p> 
            <h3>
              {title}
              {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 383.27 383.35">
              <g>
                  <path d="M56.15,383.35c-4.54-1.21-9.18-2.12-13.59-3.67C16.91,370.66.02,346.79.01,319.71,0,248.48,0,177.24.02,106c.01-34.4,27.67-62.83,62.08-63.29,28.81-.38,57.62-.2,86.44-.09,12.69.05,22.24,9.63,21.98,21.56-.26,12.03-9.9,21.11-22.56,21.12-27.57.04-55.13,0-82.7.01-13.75,0-22.6,8.89-22.6,22.73,0,69.99,0,139.98,0,209.97,0,13.72,8.97,22.67,22.71,22.67,69.97.01,139.95.01,209.92,0,13.81,0,22.67-8.88,22.68-22.67.02-27.57-.01-55.14.01-82.71.01-11.79,7.11-20.21,18.57-22.19,11.7-2.01,23.71,7.54,23.99,19.47.29,12.59.13,25.2.13,37.8,0,16.59.17,33.19-.06,49.78-.44,31.95-22.85,57.53-54.46,62.52-.59.09-1.14.44-1.7.66H56.15Z"/>
                  <path d="M383.27,153.49c-2.1,3.6-3.67,7.69-6.41,10.71-5.78,6.36-15.23,8.06-23.04,4.59-8.39-3.73-13.09-10.32-13.14-19.58-.14-23.7-.05-47.41-.05-71.12,0-1.36,0-2.73,0-4.99-1.51,1.43-2.54,2.36-3.52,3.34-57.16,57.16-114.33,114.31-171.44,171.53-6.46,6.47-13.84,9.28-22.72,6.68-14.93-4.38-20.16-22.6-10.02-34.4,1.06-1.23,2.24-2.35,3.38-3.49,56.71-56.73,113.42-113.46,170.15-170.17,1.06-1.06,2.27-1.95,3.42-2.92-.11-.34-.21-.68-.32-1.02-1.26,0-2.52,0-3.78,0-23.7,0-47.4.02-71.1-.01-11.71-.02-20.56-8.11-21.84-19.83-1.1-10.05,6.4-20.02,16.97-22.4C231.6,0,233.52.02,235.37.02,277.04,0,318.7,0,360.36,0c11.51,0,18.25,4.77,22.22,15.7.11.3.45.51.69.77v137.02Z"/>
              </g>
            </svg> */}
            </h3>  

            </div>
            <div className="region">
            <p className="region-event">{event["Région"] && isWellFormatted(event["Région"]) && (`${event["Région"]} `)}</p>
            <p className="ville-event">{event["Ville"] && isWellFormatted(event["Ville"]) && (`${event["Ville"]} `)}</p>
            </div>
          </div>

      
      </a>
    </div>
  )
}

const formatOptionID = (str:string) => { return str.replace(" ", "").toLowerCase() }

const Dropdown = ({data, selectedFilters, setSelectedFilters}:any) => {

  const [isOpen, setIsOpen] = useState(false);    
  const toggleMenu = () => { setIsOpen(!isOpen) };

  const [buttonLabel, setButtonLabel] = useState(data.name)

  const selectOption = (e:any) => {
    e.preventDefault()

    setButtonLabel(e.currentTarget.getAttribute("data-label"))
    const updatedFilters =  { ...selectedFilters }
    updatedFilters[data.type] = e.currentTarget.getAttribute("data-type")
    setSelectedFilters(updatedFilters)
    setIsOpen(false)
  }

  const [buttonWidth, setButtonWidth] = useState(0)
  const updateButtonWidth = () => {
    const buttonElement = document.getElementById(data.type);
    if (buttonElement) {
      setButtonWidth(buttonElement.offsetWidth);
    }
  };

  useEffect(() => {
    updateButtonWidth()
    window.addEventListener('resize', updateButtonWidth);
    return () => {
      window.removeEventListener('resize', updateButtonWidth);
    };
  },[data.type])
  return (
    <div className="dropdown-container">
      <button 
        id={data.type}
        role="combobox" 
        className={`dropdown ${isOpen ? 'toggle' : ''}`} 
        onClick={toggleMenu} 
        data-type={data.type}
        aria-controls="listbox"
        aria-haspopup="listbox"
        tabIndex={0}
        aria-expanded="false"
      >{buttonLabel}
      </button>
      

      <ul role="listbox" className={`listbox ${isOpen ? 'toggle' : ''} `} style={{width: buttonWidth + 'px'}}>
        <li role="option">
          <button 
            id="all-types" 
            data-type="all" 
            data-label={data.name} 
            onClick={(e) => {selectOption(e)}}
          >Effacer le filtre</button>
        </li> 
        {data.options.map((option:string, index:number) => { 
            return ( 
              <li key={index} role="option">
                <button 
                  data-type={formatOptionID(option)} 
                  data-label={option} 
                  id={formatOptionID(option)} 
                  onClick={(e) => {selectOption(e)}}
                >{option}</button>
              </li> 
            )
        })}
      </ul>

    </div>
  )
}

const TextSearch = ({data, selectedFilters, setSelectedFilters}:any) => {

  const [inputLabel, setInputLabel] = useState("")
  
  const handleChange = (e:any) => {
    setInputLabel(e.target.value)
    const updatedFilters =  { ...selectedFilters }
    updatedFilters[data.type] = e.target.value
    setSelectedFilters(updatedFilters)
  }
  return (
    <form className="plainsearch-container" onSubmit={(e) => {e.preventDefault()}}>
      <input
          type="text"
          id="plaintext"
          name="plaintext"
          placeholder={data.name}
          value={inputLabel}
          onChange={handleChange}
      />
    </form>
  )
}
const Filters = ({events, selectedFilters, setSelectedFilters}:any) => {
  // type, date, lieux, plaintext
  const types = [...new Set(events.filter((event:any) => ((event["Type"] !== undefined) && (event["Type"] !== ""))).map((event:any) => event["Type"]))]
  const lieux = [...new Set(events.filter((event:any) => ((event["Région"] !== undefined) && (event["Région"] !== ""))).map((event:any) => event["Région"]))]
  /* const dates = ["évènements passés", "évènements futur"] */
  return (
    <div className="filters-container">
      {/* <div className="filter">
        <h3>Type d'évènements</h3>
        {types.map(type => {
          return (

          )
        })}
        <Dropdown 
          data={{ name:"Tous les types", options:types, type:"type" }} 
          selectedFilters={selectedFilters} 
          setSelectedFilters={setSelectedFilters}
        />
      </div> */}
      <div className="filter">
        <h3>Zones géographiques</h3>
        <Dropdown 
          data={{ name:"Toutes les régions et pays", options:lieux, type:"lieu" }} 
          selectedFilters={selectedFilters} 
          setSelectedFilters={setSelectedFilters}
        />
      </div>
      {/* <div className="filter">
        <h3>Dates</h3>
        <Dropdown 
          data={{ name:"Toutes les dates", options:dates, type:"date" }} 
          selectedFilters={selectedFilters} 
          setSelectedFilters={setSelectedFilters}
        />
      </div> */}
      {/* <div className="filter">
        <h3>Recherche</h3>
        <TextSearch 
          data={{ name:"Entrez votre texte", type:"plaintext" }} 
          selectedFilters={selectedFilters} 
          setSelectedFilters={setSelectedFilters}
        />
      </div> */}
    </div>
  )
}

/* const parseDate = (dateString: string) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};
 */
/* const sortContent = (content: any) => {
  return content.sort((a: any, b: any) => {
    return +parseDate(b["Date début"]) - +parseDate(a["Date début"]);
  });
}; */

const filterContent = (content: any, filters: any) => {

  const cleaned:any = [...new Set(content.filter((event:any) => (
    (event["Type"] !== undefined) && (event["Type"] !== "") &&
    (event["Région"] !== undefined) && (event["Région"] !== "") 
  )))]
  return cleaned.filter((event: any) => {
    const matchesType = filters.type === "all" || formatOptionID(event.Type) === filters.type;
    const matchesLieu = filters.lieu === "all" || formatOptionID(event["Région"]) === filters.lieu;

    const lowerCaseSearchText = filters.plaintext.toLowerCase();
    //console.log(lowerCaseSearchText)
    if (filters.plaintext === ""){
      var matchesPlaintext = true
    }
    else {
      var matchesPlaintext =  Object.values(event).some(value => 
        value && value.toString().toLowerCase().includes(lowerCaseSearchText)
      ); 
    }
    
    return matchesType && matchesLieu && matchesPlaintext /*&&  matchesDate */;
  });
};

    /* const currentDate = new Date();
    switch (filters.date){
      case "évènementspassés":
        var matchesDate = parseDate(event["Date début"]) < currentDate;
        break
      case "évènementsfutur":
        var matchesDate = parseDate(event["Date début"]) > currentDate;
        break
      default:
        var matchesDate = true
        break
    } */
const TableEvent = ({content}:any) => {

  const [sortedContent, setSortedContent] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (!content) return;
    const cleaned:any = [...new Set(content.filter((event:any) => ((event["Date début"] !== undefined) && (event["Date début"] !== ""))))]
    setSortedContent(cleaned);
    //setSortedContent(sortContent(cleaned));
  }, [content]);

  useEffect(() => {
    setEvents(sortedContent);
  }, [sortedContent]);

  const initialFilters = {
    type: "all",
    date: "all",
    lieu: "all",
    plaintext: ""
  }

  const [selectedFilters, setSelectedFilters] = useState(initialFilters)
  useEffect(() => {
    if (!sortedContent.length) return;
    let filteredContent = filterContent(sortedContent, selectedFilters);
    setEvents(filteredContent);
  }, [selectedFilters, sortedContent])

  return (
    <section className="event-container">
      {events && (<Filters events={sortedContent} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}/>)}
      <div className="legend-type">
        <p className="conference">Conférences</p>
        <p className="grandpublic">Grand Public</p>
        <p className="salonprofessionnel">Salons Professionnels</p>
        <p className="festival">Festival</p>
      </div>
      {/* <p className="legend">Nous participons</p> */}
      <div className={`events ${events.length === 1 ? "single" : ""}`}>
        {events && events.map((event:any, index:number) => {
          if (event["Evènement"] === "") {
            return null;
          }
          return <EventCard event={event} key={index} />;
        })}
      </div>
    </section>
  )
}

export default TableEvent