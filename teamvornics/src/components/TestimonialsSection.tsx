import React from "react";

export function TestimonialsSection() {
  const testimonials = [
    {
     id: "abhinav-bansal",
      name: "Abhinav Bansal",
      title: "Frontend Developer,Chatbot Designer,Tool Expert",
      description:
        "Abhinav leads the development of responsive interfaces and ensures seamless user experiences across all platforms.",
      quote:
        "Abhinav leads the development of responsive interfaces and ensures seamless user experiences across all platforms.",
      image: "/public/images/testimonials/abhinav.jpg",
    },
    {
      id: "ankit-saini",
      name: "Ankit Saini",
      title: "Backend Developer",
      description:
        "Ankit designs and maintains the core server infrastructure, delivering robust APIs and scalable backend systems.",
      quote:
        "Ankit designs and maintains the core server infrastructure, delivering robust APIs and scalable backend systems.",
      image: "/public/images/testimonials/ankit.jpg",
    },
    {
      id: "yogesh-shah",
      name: "Yogesh Shah",
      title: "UI/UX Designer",
      description:
        "Yogesh crafts intuitive design systems that blend aesthetics with functionality for optimal user engagement.",
      quote:
        "Yogesh crafts intuitive design systems that blend aesthetics with functionality for optimal user engagement.",
      image: "/public/images/testimonials/yogesh.jpg",
    },
    {
      id: "harshita-tripathi",
      name: "Harshita Tripathi",
      title: "DevOps Engineer",
      description:
        "Harshita automates deployments and ensures continuous integration pipelines run smoothly across environments.",
      quote:
        "Harshita automates deployments and ensures continuous integration pipelines run smoothly across environments.",
      image: "/public/images/testimonials/harshita.jpg",
    },
  ];

  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-center text-3xl font-bold tracking-wide uppercase mb-12">
          Meet Our Maritime Experts
        </h2>

        {/* Card Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((person) => (
            <div
              key={person.id}
              className="bg-gray-800 rounded-2xl p-6 text-center shadow-lg flex flex-col h-full"
            >
              {/* Profile Image */}
              <div className="w-24 h-24 mx-auto mb-4">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
                />
              </div>

              {/* Name */}
              <h3 className="text-xl font-semibold">{person.name}</h3>

              {/* Role */}
              <p className="text-sm text-gray-400">
                {person.title}, {person.company}
              </p>

              {/* Divider */}
              <div className="w-12 h-1 bg-indigo-500 mx-auto my-4"></div>

              {/* Quote */}
              <p className="text-gray-300 text-sm flex-grow">
                “{person.quote}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
