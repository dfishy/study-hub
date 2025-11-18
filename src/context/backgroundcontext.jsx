import { createContext, useContext, useState } from 'react';

const BackgroundContext = createContext();

export const BackgroundProvider = ({ children }) => {
  const [activeBackground, setActiveBackground] = useState('default');
  const [purchasedBackgrounds, setPurchasedBackgrounds] = useState(['default']);
  const [points, setPoints] = useState(0);

  // Available backgrounds for purchase
  const backgrounds = [
    { 
      id: 'default', 
      name: 'Default', 
      image: '', 
      cost: 0,
    },
    { 
      id: 'forest', 
      name: 'Forest', 
      image: '/backgrounds/forest.jpg', 
      cost: 0,
    },
    { 
      id: 'space', 
      name: 'Space', 
      image: '/backgrounds/space.jpg', 
      cost: 10,
    },
    { 
      id: 'library', 
      name: 'Library', 
      image: '/backgrounds/library.jpg', 
      cost: 30,
    }
  ];

  const purchaseBackground = (backgroundId) => {
    const bg = backgrounds.find(b => b.id === backgroundId);
    if (!bg) return { success: false, message: 'Background not found' };
    
    if (purchasedBackgrounds.includes(backgroundId)) {
      return { success: false, message: 'Already owned' };
    }
    
    if (points < bg.cost) {
      return { success: false, message: 'Not enough points' };
    }
    
    setPoints(points - bg.cost);
    setPurchasedBackgrounds([...purchasedBackgrounds, backgroundId]);
    setActiveBackground(backgroundId);
    return { success: true, message: 'Purchase successful!' };
  };

  const changeBackground = (backgroundId) => {
    if (purchasedBackgrounds.includes(backgroundId)) {
      setActiveBackground(backgroundId);
      return true;
    }
    return false;
  };

  const getActiveBackgroundStyle = () => {
    const bg = backgrounds.find(b => b.id === activeBackground);
    if (!bg) return {};
    
    if (bg.image) {
      return {
        backgroundImage: `url(${bg.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      };
    }
    return {};
  };

  return (
    <BackgroundContext.Provider value={{ 
      activeBackground, 
      purchasedBackgrounds,
      backgrounds,
      points,
      setPoints,
      purchaseBackground,
      changeBackground,
      getActiveBackgroundStyle
    }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);