import React, { useEffect, useState } from 'react';
import casinoService from '../../services/casino.service';
import { Link } from 'react-router-dom';

interface Provider {
  _id: string;
  game_image: string;
}

export const OurProvider = ({ queryType = 'all' }: { queryType?: string }) => {
  const [providers, setProviders] = useState<Provider[]>([]);


  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await casinoService.getIntCasinoList('all');

        const providersArr = response?.data?.result?.map((p: any) => ({
          _id: p._id,
          game_image: p.provider_image
        }));

        console.log(providersArr, 'providers')

        setProviders(providersArr);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };
    fetchProviders();
  }, []);


  return (
    <div style={{ width: '100%', height: 'auto' }}>
      <div className='ourProviderContainer'>
        <h2>
          Our Providers
        </h2>
      </div>
      <div className='ourProviderContainerDiv'>
        {providers.length > 0 ? (
          providers.map((provider, index) => (
            //   <div
            //      key={index}
            //      className='ourProviderCard'
            //     >
            //       <img
            //           src={provider.game_image}
            //           alt={provider._id}
            //         />
            //       <p>{provider._id}</p>
            //    </div>
            <Link
              key={index}
              to={`/casino-int/${queryType}?category=${provider._id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className='ourProviderCard'
              >
                <img
                  src={provider.game_image.includes('png') ? provider.game_image : '/imgs/common.jpg'}
                  alt={provider._id}
                />
                <p>
                  {provider._id}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>Loading providers...</p>
        )}
      </div>
    </div>
  );
};
