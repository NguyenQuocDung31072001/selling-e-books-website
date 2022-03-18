import React from 'react';
import { Slide,Fade  } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import "../css/slideshow_user.css"
const slideImages = [
  {
    url: 'https://image.shutterstock.com/image-vector/modern-ebooks-concept-laptop-flying-260nw-1113506387.jpg',
    
  },
  {
    url: 'https://thumbs.dreamstime.com/z/reading-books-e-book-stack-white-background-concept-education-146921685.jpg',
    
  },
  {
    url: 'https://media.istockphoto.com/vectors/electronic-book-ebook-with-laptop-and-yellow-background-vector-id604826338?s=612x612',
    
  },
];

const SlideshowUser = () => {
    return (
        <div className="w-[1400px] m-auto z-0">
          <Slide className="" canSwipe={false}>
           {slideImages.map((slideImage, index)=> (
              <div  key={index}>
                <img className="flex items-center justify-center w-full h-[300px] object-cover" src={slideImage.url} alt="" />
              </div>
            ))} 
          </Slide>
        </div>
      )
}
export default SlideshowUser