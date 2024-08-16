import React from 'react';

const AboutUs = () => {
 const teamMembers = [
    {
      name: 'Dhruv',
      image: './1.jpg',
    },
    {
      name: 'Gurpreet',
      image: './2.jpg',
    },
    {
      name: 'Sukhbir',
      image: './3.jpg',
    },
    {
      name: 'Kunal ',
      image: './4.jpg',
    },
    {
      name: 'Rutvik',
      image: './5.jpg',
    }
  ];

  return (
    <div>
      <div className="sm:flex items-center max-w-screen-xl">
        <div className="sm:w-1/2 p-10">
          <div className="image object-center text-center">
            <img src="./minishopLogo.png" alt="Company Logo" />
          </div>
        </div>
        <div className="sm:w-1/2 p-5">
          <div className="text">
            <span className="text-gray-500 border-b-2 border-indigo-600 uppercase">About us</span>
            <h2 className="my-4 font-bold text-3xl sm:text-4xl">
              About <span className="text-indigo-600">Our Company</span>
            </h2>
            <p className="text-gray-700">
              Welcome to MiniShop, your one-stop destination for all your shopping needs. Like Amazon, we offer a wide range of products from electronics and fashion to home essentials and more. Our mission is to provide a seamless online shopping experience with the best prices, vast selection, and fast delivery.
            </p>
            <p className="text-gray-700">
              Our team is dedicated to ensuring customer satisfaction, constantly working to expand our product offerings and improve our services. Whether you're looking for the latest gadgets, trendy apparel, or daily necessities, MiniShop has it all. Shop with us and discover a new way to buy everything you need, all in one place.
            </p>
          </div>
        </div>
      </div>

      <section id="our-team" className="bg-gray-100 py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 my-6 text-center">
                <img src={member.image} alt={`Team Member ${index + 1}`} className="w-full rounded-full mb-4" />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
