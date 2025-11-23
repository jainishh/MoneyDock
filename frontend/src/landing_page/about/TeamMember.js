import React from "react";
import { useState } from "react";
import "./TeamMember.css";

function TeamMember() {
  const [open, setOpen] = useState(null);
  const toggleButton = (index) => {
    setOpen(index === open ? null : index);
  };
  return (
    <div className="team-grid">
      {[
        {
          name: "Nikhil Kamath",
          rol: "Co-founder & CFO",
          image: "media/images/Nikhil.jpg",
          bio: "Nikhil is an astute and experienced investor, and he heads financial planning at MoneyDock. An avid reader, he always appreciates a good game of chess.",
        },
        {
          name: "Dr. Kailash Nadh",
          rol: "CTO",
          image: "media/images/kailash.jpg",
          bio: "Kailash has a PhD in Artificial Intelligence & Computational Linguistics, and is the brain behind all our technology and products. He has been a developer from his adolescence and continues to write code every day.",
        },
        {
          name: "Venu Madhav",
          rol: "COO",
          image: "media/images/Venu.jpg",
          bio: "Venu is the backbone of MoneyDock taking care of operations and ensuring that we are compliant to rules and regulations. He has over a dozen certifications in financial markets and is also proficient in technical analysis. Workouts, cycling, and adventuring is what he does outside of MoneyDock.",
        },
        {
          name: "Hanan Delvi",
          rol: "CCO",
          image: "media/images/Hanan.jpg",
          bio: "We take pride in the way we support our clients, and Hanan is responsible for this with his never ending flow of energy. He is the man behind many of our support initiatives that have helped us stay ahead of the game. A free thinker, Hanan can be seen posing as one in his free time.",
        },
        {
          name: "Seema Patil",
          rol: "Director",
          image: "media/images/Seema.jpg",
          bio: "Seema who has lead the quality team since the beginning of MoneyDock, is now a director. She is an extremely disciplined fitness enthusiast.",
        },
        {
          name: "Karthik Rangappa",
          rol: "Chief of Education",
          image: "media/images/Karthik.jpg",
          bio: "Karthik Guru Rangappa single handledly wrote Varsity, MoneyDock's massive educational program. He heads investor education initiatives at MoneyDock and loves stock markets, classic rock, single malts, and photography.",
        },
        {
          name: "Austin Prakesh",
          rol: "Director Strategy",
          image: "media/images/Austin.jpg",
          bio: "Austin is a successful self-made entrepreneur from Singapore. His area of specialty revolves around helping organisations including grow by optimizing revenue streams and creating growth strategies. He is a boxing enthusiast and loves collecting exquisite watches.",
        },
      ].map((member, index) => (
        <div
          key={index}
          className={`teamMembers ${open === index ? "setMargin" : ""}`}
        >
          <div className="member-info">
            <img
              className="member-image"
              src={member.image}
              alt={member.name}
            ></img>
            <h5 className="member-name">{member.name}</h5>
            <p className="member-roll">{member.rol}</p>
            <button
              className="toggle-button"
              onClick={() => toggleButton(index)}
            >
              Bio
              {index === open ? (
                <i class=" text-muted fa-solid fa-chevron-down"></i>
              ) : (
                <i class="text-muted fa-solid fa-chevron-up"></i>
              )}
            </button>
            <div
              className={`member-bio ${
                index === open ? "member-bio-show" : ""
              }`}
            >
              {member.bio}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TeamMember;
