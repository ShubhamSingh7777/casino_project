import Carousel from 'react-bootstrap/Carousel';

const Carouselslider: React.FC = () => {
  return (
    <Carousel style={{margin:'10px 0'}}>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/imgs/carousel/296.png"
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/imgs/carousel/294.png"
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
           src="/imgs/carousel/694.png"
          alt="Third slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
           src="/imgs/carousel/902.png"
          alt="Third slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
           src="/imgs/carousel/937.png"
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default Carouselslider;
