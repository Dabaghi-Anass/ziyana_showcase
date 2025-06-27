import { useEffect, useState } from 'react';

type Story = {
  image: string;
  title: string;
  description: string;
};
export function StoryPage() {
  const [stories, setStories] = useState<Story[]>([]);
  async function getData() {
    const res = await fetch('src/api/story.json');
    const data = await res.json();
    setStories(data);
    console.log(data);
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <h1 className='page-header'>قصة القفطان</h1>
      <div className='story-page'>
        {stories.map((story, index) => (
          <section key={index} className='story-section'>
            {index % 2 === 0 ? (
              <>
                <img
                  src={story.image}
                  alt={story.title}
                  className='story-image fanous'
                />
                <div className='story-content'>
                  <div className='story-header'>
                    <img src='src/assets/images/fanous.png' />
                    <h2 className='story-title'>{story.title}</h2>
                  </div>
                  <div className='story-description-container'>
                    <p className='story-description'>{story.description}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='story-content'>
                  <div className='story-header'>
                    <img src='src/assets/images/fanous.png' />
                    <h2 className='story-title'>{story.title}</h2>
                  </div>
                  <div className='story-description-container'>
                    <p className='story-description'>{story.description}</p>
                  </div>
                </div>
                <img
                  src={story.image}
                  alt={story.title}
                  className='story-image fanous'
                />
              </>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
