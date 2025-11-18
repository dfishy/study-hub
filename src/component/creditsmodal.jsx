import React from 'react';

const CreditsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const backgroundCredits = [
    {
      name: 'Spiral Galaxy M83',
      html: `"<a rel="noopener noreferrer" href="https://www.flickr.com/photos/hubble_space_telescope_images/8539791715" target="_blank">Spiral Galaxy M83, Hubble Space Telescope</a>" by <a rel="noopener noreferrer" href="https://www.flickr.com/photos/hubble_space_telescope_images" target="_blank">HubbleColor {Zolt}</a> is marked with <a rel="noopener noreferrer" href="https://creativecommons.org/publicdomain/mark/1.0/?ref=openverse" target="_blank">Public Domain Mark 1.0</a>.`
    },
    {
      name: 'Headwaters Forest Reserve',
      html: `"<a rel="noopener noreferrer" href="https://www.flickr.com/photos/50976304@N07/33025496163" target="_blank">Headwaters Forest Reserve</a>" by <a rel="noopener noreferrer" href="https://www.flickr.com/photos/50976304@N07" target="_blank">blmcalifornia</a> is marked with <a rel="noopener noreferrer" href="https://creativecommons.org/publicdomain/mark/1.0/?ref=openverse" target="_blank">Public Domain Mark 1.0</a>.`
    },
    {
      name: 'library',
      html: `"<a rel="noopener noreferrer" href="https://www.flickr.com/photos/51954575@N00/29436564757" target="_blank">library</a>" by <a rel="noopener noreferrer" href="https://www.flickr.com/photos/51954575@N00" target="_blank">Chilanga Cement</a> is marked with <a rel="noopener noreferrer" href="https://creativecommons.org/publicdomain/mark/1.0/?ref=openverse" target="_blank">Public Domain Mark 1.0</a>.`
    }
  ];

  const musicCredits = [
    {
      name: 'lofi1',
      html: `lofi1 by <a href="https://pixabay.com/users/fassounds-3433550/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=160166">FASSounds</a> from <a href="https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=160166">Pixabay</a>`
    },
    {
      name: 'lofi2',
      html: `lofi2 by <a href="https://pixabay.com/users/dailyjourney2023-33065298/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=141222">DailyJourney2023</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=141222">Pixabay</a>`
    },
    {
      name: 'lofi3',
      html: `lofi3 by <a href="https://pixabay.com/users/fassounds-3433550/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=112191">FASSounds</a> from <a href="https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=112191">Pixabay</a>
`
    },
    {
      name: 'lofi4',
      html: `lofi4 by <a href="https://pixabay.com/users/chill_background-25283030/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=110111">chill_background</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=110111">Pixabay</a>`
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-amber-100 border-b-2 border-amber-300 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-['VT323'] text-amber-900">Credits</h2>
            <button 
              onClick={onClose}
              className="text-amber-900 hover:text-amber-700 text-3xl font-bold leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Background Images Section */}
          <section>
            <h3 className="text-2xl font-['VT323'] text-amber-900 mb-3">
              Images
            </h3>
            <div className="space-y-2 text-sm text-amber-800">
              {backgroundCredits.map((credit, index) => (
                <p 
                  key={index}
                  dangerouslySetInnerHTML={{ __html: credit.html }}
                />
              ))}
            </div>
          </section>

          {/* Music Section */}
          <section>
            <h3 className="text-2xl font-['VT323'] text-amber-900 mb-3">
              Music
            </h3>
            <div className="space-y-2 text-sm text-amber-800">
              {musicCredits.map((credit, index) => (
                <p 
                  key={index}
                  dangerouslySetInnerHTML={{ __html: credit.html }}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreditsModal;