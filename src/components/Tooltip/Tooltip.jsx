import { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import { IconButton } from 'components';

import css from './Tooltip.module.css';

import { CLOSE } from 'utils/variables';

const Tooltip = ({
  title,
  content,
  children,
  preferablePosition,
  offset = 8,
  isRich,
  isRichVisible
}) => {
  const { windowWidth } = useSelector(state => state.app);

  const targetRef = useRef(null);
  const tooltipRef = useRef(null);

  const [position, setPosition] = useState({ top: 0, left: 0, visibility: 'hidden' });
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState(null);

  const calculateTooltipPosition = () => {
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const positions = {
      top: {
        top: targetRect.top - tooltipRect.height - offset,
        left: targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
      },
      topRight: {
        top: targetRect.top - tooltipRect.height - offset,
        left: targetRect.right - tooltipRect.width
      },
      topLeft: {
        top: targetRect.top - tooltipRect.height - offset,
        left: targetRect.left
      },
      bottom: {
        top: targetRect.top + targetRect.height + offset,
        left: targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
      },
      bottomRight: {
        top: targetRect.top + targetRect.height + offset,
        left: targetRect.right - tooltipRect.width
      },
      bottomLeft: {
        top: targetRect.top + targetRect.height + offset,
        left: targetRect.left
      },
      left: {
        top: targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2),
        left: targetRect.left - tooltipRect.width - offset
      },
      leftTop: {
        top: targetRect.top,
        left: targetRect.left - tooltipRect.width - offset
      },
      leftBottom: {
        top: targetRect.bottom - tooltipRect.height,
        left: targetRect.left - tooltipRect.width - offset
      },
      right: {
        top: targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2),
        left: targetRect.left + targetRect.width + offset
      },
      rightTop: {
        top: targetRect.top,
        left: targetRect.right + offset
      },
      rightBottom: {
        top: targetRect.bottom - tooltipRect.height,
        left: targetRect.right + offset
      }
    };

    if (preferablePosition) {
      setPosition({ ...positions[preferablePosition], visibility: 'visible' });
    }
    else {
      let chosenPosition = positions.top;

      if (chosenPosition.top < 0) {
        chosenPosition = positions.bottom;
      }
      if (chosenPosition.top + tooltipRect.height > window.innerHeight) {
        chosenPosition = positions.top;
      }
      if (chosenPosition.left < 0) {
        chosenPosition = positions.right;
      }
      if (chosenPosition.left + tooltipRect.width > window.innerWidth) {
        chosenPosition = positions.left;
      }

      setPosition({ ...chosenPosition, visibility: 'visible' });
    }
  };

  useEffect(() => {
    if (isRich && isRichVisible) {
      calculateTooltipPosition();
      setVisible(true);
    }
    else if (isRich && !isRichVisible) {
      setVisible(false);
      setPosition(prev => ({ ...prev, visibility: 'hidden' }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth, isRichVisible]);

  const handleMouseEnter = () => {
    if (isRich) return;

    if (windowWidth > 480) {
      const enter = setTimeout(() => {
        try {
          calculateTooltipPosition();
          setVisible(true);
        } catch (error) {
          console.error(error);
        }
      }, 1000);
      setTimer(enter);
    }
  };

  const handleMouseLeave = () => {
    if (isRich) return;

    clearTimeout(timer);
    setVisible(false);
    setPosition(prev => ({ ...prev, visibility: 'hidden' }));
  };

  const handleClose = () => {
    setVisible(false);
    setPosition(prev => ({ ...prev, visibility: 'hidden' }));
  };

  return (
    <div
      ref={targetRef}
      onClick={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {ReactDOM.createPortal(
        <div
          ref={tooltipRef}
          className={`${css.tooltip} ${visible && css.visible} ${isRich && css.rich}`}
          style={position}
          onMouseEnter={handleMouseLeave}
          onMouseLeave={e => e.stopPropagation()}
        >
          {isRich && (
            <div className={css.header}>
              <span className={css.title}>{title}</span>
              <IconButton variant="tooltip" path={CLOSE} onClick={handleClose} />
            </div>
          )}
          {content}
        </div>,
        document.body
      )}
    </div>
  );
};

export default Tooltip;