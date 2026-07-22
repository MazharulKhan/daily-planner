import { useRef, useState } from 'react';
import { authShowcaseSlides } from '../data/authShowcaseSlides';

const SWIPE_DISTANCE = 40;
const HORIZONTAL_SWIPE_RATIO = 1.15;

function wrapIndex(index) {
  return (index + authShowcaseSlides.length) % authShowcaseSlides.length;
}

function ArrowIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={direction === 'previous' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AuthShowcaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [imageErrors, setImageErrors] = useState({});
  const pointerStart = useRef(null);

  const previousIndex = wrapIndex(activeIndex - 1);
  const nextIndex = wrapIndex(activeIndex + 1);
  const activeSlide = authShowcaseSlides[activeIndex];

  function move(step) {
    setDirection(step > 0 ? 'forward' : 'backward');
    setActiveIndex((currentIndex) => wrapIndex(currentIndex + step));
  }

  function selectSlide(targetIndex) {
    if (targetIndex === activeIndex) return;

    const forwardDistance = wrapIndex(targetIndex - activeIndex);
    const backwardDistance = wrapIndex(activeIndex - targetIndex);
    setDirection(forwardDistance <= backwardDistance ? 'forward' : 'backward');
    setActiveIndex(targetIndex);
  }

  function getPosition(index) {
    if (index === activeIndex) return 'active';
    if (index === previousIndex) return 'previous';
    if (index === nextIndex) return 'next';
    return 'hidden';
  }

  function handleKeyDown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  }

  function handlePointerDown(event) {
    if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;

    pointerStart.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handlePointerUp(event) {
    const start = pointerStart.current;
    pointerStart.current = null;

    if (!start || start.id !== event.pointerId) return;

    const horizontalDistance = event.clientX - start.x;
    const verticalDistance = event.clientY - start.y;
    const isHorizontalSwipe =
      Math.abs(horizontalDistance) >= SWIPE_DISTANCE &&
      Math.abs(horizontalDistance) > Math.abs(verticalDistance) * HORIZONTAL_SWIPE_RATIO;

    if (isHorizontalSwipe) move(horizontalDistance < 0 ? 1 : -1);
  }

  function handlePointerCancel() {
    pointerStart.current = null;
  }

  function markImageError(slideId, hasError) {
    setImageErrors((currentErrors) => {
      if (Boolean(currentErrors[slideId]) === hasError) return currentErrors;

      return {
        ...currentErrors,
        [slideId]: hasError,
      };
    });
  }

  return (
    <section
      className="auth-showcase"
      aria-label="Daily Planner product showcase"
      aria-roledescription="carousel"
      tabIndex={0}
      data-direction={direction}
      onKeyDown={handleKeyDown}
    >
      <div
        className="auth-showcase__viewport"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {authShowcaseSlides.map((slide, index) => {
          const position = getPosition(index);
          const hasImageError = Boolean(imageErrors[slide.id]);

          return (
            <div
              key={slide.id}
              className={`auth-showcase__slide auth-showcase__slide--${position}`}
              aria-hidden={position !== 'active'}
            >
              <picture
                className={`auth-showcase__picture${hasImageError ? ' auth-showcase__picture--error' : ''}`}
              >
                <source media="(max-width: 760px)" srcSet={slide.mobileSrc} />
                <img
                  src={slide.desktopSrc}
                  alt=""
                  width="1024"
                  height="640"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  draggable="false"
                  onLoad={() => markImageError(slide.id, false)}
                  onError={() => markImageError(slide.id, true)}
                />
              </picture>
              {hasImageError && (
                <div className="auth-showcase__placeholder">
                  <span>Preview unavailable</span>
                  <strong>{slide.title}</strong>
                </div>
              )}
            </div>
          );
        })}

        <button
          type="button"
          className="auth-showcase__arrow auth-showcase__arrow--previous"
          aria-label="Show previous feature"
          onClick={() => move(-1)}
        >
          <ArrowIcon direction="previous" />
        </button>
        <button
          type="button"
          className="auth-showcase__arrow auth-showcase__arrow--next"
          aria-label="Show next feature"
          onClick={() => move(1)}
        >
          <ArrowIcon direction="next" />
        </button>
      </div>

      <div className="auth-showcase__dots" role="group" aria-label="Choose a feature">
        {authShowcaseSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className="auth-showcase__dot"
            aria-label={`Show slide ${index + 1}: ${slide.title}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => selectSlide(index)}
          />
        ))}
      </div>

      <div
        key={activeSlide.id}
        className="auth-showcase__caption"
      >
        <h2>{activeSlide.title}</h2>
        <p>{activeSlide.caption}</p>
      </div>
      <p
        className="auth-showcase__sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Slide {activeIndex + 1} of {authShowcaseSlides.length}: {activeSlide.title}
      </p>
    </section>
  );
}
