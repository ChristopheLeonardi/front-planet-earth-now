import EmblaCarousel from '../emblaCarousel/EmblaCarousel'
import { EmblaOptionsType } from 'embla-carousel'


interface SlideObj {
  url: string;
  alternativeText: string;
}

const Slideshow = ({data}:any) => {
    //const slideImages: SlideObj[] = []
    const SLIDES:Array<SlideObj> = [
      ...data.map((entry:any) => {
        return {
          "url": entry.attributes.url,
          "alternativeText": entry.attributes.caption
        }
      })
    ]
    const OPTIONS: EmblaOptionsType = { loop: true }
    return (
      <div className="slide-container">
            <EmblaCarousel slides={SLIDES} options={OPTIONS} />
      </div>
    )
}

export default Slideshow