import { motion, useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function App() {
  

  /* ================= GRAVITY PARTICLES ================= */
  const [particles, setParticles] = useState([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hue, setHue] = useState(0);

  useEffect(() => {
    const particleCount = 60;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);
  }, []);

  const handleMouseMove = (e) => {
    setMouse({ x: e.clientX, y: e.clientY });
    setHue((h) => (h + 4) % 360);
  };

  /* ================= GLASS ================= */
  const glass = {
    background:
      "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(0,0,0,0.75))",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.55)"
  };

  /* ================= HERO BG ================= */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

  /* ================= TILT CARD EFFECT ================= */
  const [tiltAngles, setTiltAngles] = useState({});

  const handleCardMouseMove = (e, id) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setTiltAngles(prev => ({
      ...prev,
      [id]: { rotateX, rotateY }
    }));
  };

  const handleCardMouseLeave = (id) => {
    setTiltAngles(prev => ({
      ...prev,
      [id]: { rotateX: 0, rotateY: 0 }
    }));
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        background: "#0b0b0b",
        color: "white",
        fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* ================= GLOBAL GRAVITY ================= */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1
        }}
      >
        {particles.map((p) => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          const force = Math.min(120 / dist, 3);

          return (
            <motion.div
              key={p.id}
              animate={{
                x: p.x + (dx / dist) * force * 10,
                y: p.y + (dy / dist) * force * 10
              }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: `radial-gradient(circle, hsla(${(hue +
                  p.id * 7) %
                  360},85%,60%,0.8), transparent)`,
                boxShadow: `0 0 ${p.size * 3}px hsla(${(hue +
                  p.id * 7) %
                  360},85%,60%,0.6)`
              }}
            />
          );
        })}
      </div>

      {/* CURSOR GLOW */}
      <motion.div
        animate={{
          left: mouse.x,
          top: mouse.y,
          background: `radial-gradient(circle, hsla(${hue},85%,60%,0.3), transparent 70%)`
        }}
        transition={{ type: "spring", stiffness: 60, damping: 22 }}
        style={{
          position: "fixed",
          width: 260,
          height: 260,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          filter: "blur(60px)",
          zIndex: 0
        }}
      />

      {/* NAVBAR (STABLE) */}
      <motion.div
        style={{
          ...glass,
          position: "fixed",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 40px)",
          maxWidth: 1200,
          padding: "14px 22px",
          borderRadius: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50
        }}
      >
        <h2 style={{ color: "#ff2c2c", margin: 0, fontSize: "22px" }}>Engineered</h2>
        <div style={{ fontSize: 16, display: "flex", gap: "18px" }}>
          {["Home", "Services", "3D", "Contact"].map((i) => (
            <span key={i} style={{ cursor: "pointer" }}>
              {i}
            </span>
          ))}
        </div>
      </motion.div>

      {/* HERO */}
      <motion.div
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: "linear-gradient(180deg, #0b0b0b 0%, #1a1a1a 100%)"
        }}
      >
        {/* CONTENT */}
        <motion.div
          style={{ y: textY }}
          className="relative z-10 text-white"
        >
          <section className="px-6 py-24 text-center" style={{ position: "relative", zIndex: 10 }}>
            <p style={{
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "3px",
              opacity: 0.7,
              marginBottom: "16px"
            }}>
              Our Philosophy
            </p>

            <h2 style={{
              fontSize: "clamp(32px, 5vw, 44px)",
              marginBottom: "20px",
              fontWeight: 700
            }}>
              Design That Feels{" "}
              <span style={{ 
                fontStyle: "italic", 
                color: "#ff2c2c"
              }}>
                Intentional
              </span>
            </h2>

            <p style={{
              maxWidth: "600px",
              margin: "0 auto 40px",
              fontSize: "16px",
              opacity: 0.8,
              lineHeight: 1.6
            }}>
              We focus on clarity, balance, and timeless aesthetics — not trends.
            </p>

            <button style={{
              marginTop: "10px",
              padding: "12px 32px",
              borderRadius: "25px",
              background: "#ff2c2c",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 600
            }}>
              Explore Work
            </button>
          </section>
        </motion.div>
      </motion.div>

      {/* SERVICES */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{
          padding: "60px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          position: "relative",
          zIndex: 10
        }}
      >
        {[
          "Car Accessories",
          "Detailing & Polish",
          "Custom Modifications",
          "Garage Maintenance"
        ].map((service, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            style={{
              ...glass,
              padding: "25px",
              borderRadius: "18px",
              borderBottom: "3px solid #ff2c2c"
            }}
          >
            <h3 style={{ fontSize: "18px" }}>{service}</h3>
            <p style={{ color: "#aaa", fontSize: "14px" }}>
              High-quality service by expert technicians.
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* TIMELINE SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{
          padding: "80px 20px",
          background: "#0f0f0f",
          position: "relative",
          zIndex: 10
        }}
      >
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(26px, 5vw, 40px)",
          marginBottom: "50px"
        }}>
          Our Journey
        </h2>

        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          position: "relative"
        }}>
          {/* Timeline Line */}
          <div style={{
            position: "absolute",
            left: "20px",
            top: 0,
            bottom: 0,
            width: "2px",
            background: "#ff2c2c"
          }} />

          {[
            { year: "2018", title: "Foundation", desc: "Started with a vision to revolutionize automotive care" },
            { year: "2019", title: "Expansion", desc: "Opened our state-of-the-art facility" },
            { year: "2021", title: "Innovation", desc: "Introduced cutting-edge diagnostic technology" },
            { year: "2023", title: "Recognition", desc: "Awarded Best Automotive Service Provider" },
            { year: "2026", title: "Future Ready", desc: "Leading the industry with sustainable solutions" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              style={{
                marginBottom: "40px",
                paddingLeft: "50px",
                position: "relative"
              }}
            >
              {/* Timeline Dot */}
              <div style={{
                position: "absolute",
                left: "12px",
                top: "5px",
                width: "18px",
                height: "18px",
                background: "#ff2c2c",
                borderRadius: "50%",
                border: "3px solid #0b0b0b",
                boxShadow: "0 0 10px rgba(255, 44, 44, 0.5)"
              }} />

              <div style={{
                ...glass,
                padding: "20px",
                borderRadius: "12px"
              }}>
                <div style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#ff2c2c",
                  marginBottom: "8px"
                }}>
                  {item.year}
                </div>
                <h3 style={{
                  fontSize: "18px",
                  marginBottom: "8px"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: "#aaa",
                  fontSize: "14px",
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* PRODUCTS */}
      <div style={{
        padding: "80px 20px",
        background: "#0b0b0b",
        position: "relative",
        zIndex: 10
      }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(26px, 5vw, 40px)"
        }}>
          Popular Accessories
        </h2>

        <p style={{
          textAlign: "center",
          color: "#aaa",
          maxWidth: "600px",
          margin: "15px auto 50px"
        }}>
          Premium products trusted by car enthusiasts
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "25px",
          maxWidth: "1100px",
          margin: "auto"
        }}>
          {[
            { name: "Alloy Wheels", price: "₹45,000", img: "product1.jpg" },
            { name: "LED Headlights", price: "₹8,500", img: "product2.jpg" },
            { name: "Premium Seat Covers", price: "₹12,000", img: "product3.jpg" },
            { name: "Performance Exhaust", price: "₹32,000", img: "product4.jpg" }
          ].map((product, i) => (
            <div key={i} style={{
              background: "#141414",
              borderRadius: "18px",
              overflow: "hidden",
              borderBottom: "3px solid #ff2c2c"
            }}>
              <img
                src={`/images/${product.img}`}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover"
                }}
              />

              <div style={{ padding: "20px" }}>
                <h3 style={{ fontSize: "18px" }}>{product.name}</h3>
                <p style={{ color: "#ff2c2c", margin: "8px 0" }}>
                  {product.price}
                </p>

                <button style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  borderRadius: "25px",
                  border: "1px solid #ff2c2c",
                  background: "transparent",
                  color: "white",
                  cursor: "pointer",
                  width: "100%"
                }}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ARTICLES / NEWS */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
        style={{
          padding: "120px 20px",
          background: "linear-gradient(180deg, #0b0b0b, #101010)",
          position: "relative",
          zIndex: 10
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            textAlign: "center",
            fontSize: "clamp(30px, 5vw, 44px)"
          }}
        >
          Automobile Insights & Industry News
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          style={{
            textAlign: "center",
            color: "#aaa",
            maxWidth: "680px",
            margin: "18px auto 80px",
            fontSize: "15px"
          }}
        >
          Stay updated with the latest trends, technology breakthroughs, and performance
          innovations shaping the future of automobiles.
        </motion.p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "35px",
          maxWidth: "1250px",
          margin: "auto"
        }}>
          {[
            {
              title: "EV Revolution in India",
              desc: "Electric vehicles are transforming the Indian automotive market with improved charging infrastructure and longer ranges.",
              tag: "Electric Vehicles"
            },
            {
              title: "ADAS: Smarter & Safer Cars",
              desc: "Advanced Driver Assistance Systems are redefining vehicle safety through AI, sensors, and real-time decision making.",
              tag: "Vehicle Safety"
            },
            {
              title: "Future of Performance Engines",
              desc: "Hybrid powertrains and turbocharged downsized engines are delivering performance with higher efficiency.",
              tag: "Performance Tech"
            },
            {
              title: "Connected Cars & IoT",
              desc: "Modern vehicles are now rolling computers, offering OTA updates, diagnostics, and seamless connectivity.",
              tag: "Smart Mobility"
            }
          ].map((article, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -14, scale: 1.02 }}
              viewport={{ once: true }}
              style={{
                padding: "34px 28px",
                borderRadius: "26px",
                background: "linear-gradient(160deg, rgba(255,255,255,0.06), rgba(0,0,0,0.75))",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* TOP GLOW */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at top, rgba(255,44,44,0.25), transparent 60%)",
                opacity: 0.35
              }} />

              <span style={{
                color: "#ff2c2c",
                fontSize: "12px",
                letterSpacing: "0.6px",
                fontWeight: "600"
              }}>
                {article.tag}
              </span>

              <h3 style={{
                marginTop: "12px",
                fontSize: "20px",
                lineHeight: "1.3"
              }}>
                {article.title}
              </h3>

              <p style={{
                marginTop: "14px",
                color: "#bbb",
                fontSize: "14px",
                lineHeight: "1.6"
              }}>
                {article.desc}
              </p>

              <button style={{
                marginTop: "22px",
                background: "transparent",
                border: "1px solid #ff2c2c",
                color: "white",
                padding: "10px 22px",
                borderRadius: "30px",
                cursor: "pointer"
              }}>
                Read More →
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* TEAM WITH TILT CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        style={{
          padding: "120px 20px",
          background: "radial-gradient(circle at top, #161616, #0b0b0b)",
          position: "relative",
          zIndex: 10
        }}
      >
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(30px,5vw,44px)",
          letterSpacing: "0.5px"
        }}>
          Meet Our Team
        </h2>

        <p style={{
          textAlign: "center",
          color: "#aaa",
          margin: "14px auto 90px",
          maxWidth: "620px",
          fontSize: "15px"
        }}>
          Skilled professionals driving quality, performance, and trust
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "45px",
          maxWidth: "1250px",
          margin: "auto"
        }}>
          {[
            {
              name: "Lakshminarayan",
              role: "--------",
              level: "Management",
              img: "team1.jpg",
              bio: "Visionary leader building a premium automotive service ecosystem."
            },
            {
              name: "Jagdish Nagar",
              role: "-------",
              level: "Management",
              img: "team2.jpg",
              bio: "Oversees daily operations and ensures top-tier service delivery."
            },
            {
              name: "Ashutosh Kasaudhan",
              role: "------",
              level: "Technical Lead",
              img: "team3.jpg",
              bio: "Expert in advanced diagnostics and mechanical systems."
            },
            {
              name: "Marmik",
              role: "------",
              level: "Technician",
              img: "team4.jpg",
              bio: "Handles complex servicing and performance upgrades."
            },
            {
              name: "Lav Devangan",
              role: "-----",
              level: "Technician",
              img: "team5.jpg",
              bio: "Precision detailing and paint correction specialist."
            },
            {
              name: "Rahul",
              role: "----",
              level: "Technician",
              img: "team6.jpg",
              bio: "Installs and customizes premium automotive accessories."
            },
            {
              name: "Aditya Tomar",
              role: "----",
              level: "Support",
              img: "team7.jpg",
              bio: "Ensures a smooth and satisfying customer experience."
            },
            {
              name: "Divyansh",
              role: "----",
              level: "Tech",
              img: "team8.jpg",
              bio: "Ensures a smooth and satisfying customer experience."
            }
          ].map((member, i) => {
            const accent =
              member.level === "Management"
                ? "#ff2c2c"
                : member.level === "Technical Lead"
                ? "#ff8c2c"
                : member.level === "Support"
                ? "#2cffb3"
                : "#2c7bff";

            const cardId = `team-${i}`;
            const angles = tiltAngles[cardId] || { rotateX: 0, rotateY: 0 };

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                viewport={{ once: true }}
                onMouseMove={(e) => handleCardMouseMove(e, cardId)}
                onMouseLeave={() => handleCardMouseLeave(cardId)}
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.04), rgba(0,0,0,0.7))",
                  borderRadius: "26px",
                  padding: "40px 28px",
                  textAlign: "center",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.65)",
                  borderTop: `4px solid ${accent}`,
                  position: "relative",
                  overflow: "hidden",
                  transform: `perspective(1000px) rotateX(${angles.rotateX}deg) rotateY(${angles.rotateY}deg)`,
                  transition: "transform 0.3s ease-out"
                }}
              >
                {/* GLOW RING */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    border: `2px dashed ${accent}`,
                    position: "absolute",
                    top: "32px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    opacity: 0.25
                  }}
                />

                {/* IMAGE */}
                <img
                  src={`/images/${member.img}`}
                  alt={member.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "18px",
                    border: `4px solid ${accent}`,
                    zIndex: 2,
                    position: "relative"
                  }}
                />

                {/* NAME */}
                <h3 style={{
                  fontSize: "20px",
                  marginBottom: "6px"
                }}>
                  {member.name}
                </h3>

                {/* ROLE */}
                <p style={{
                  color: accent,
                  fontSize: "14px",
                  marginBottom: "10px",
                  fontWeight: "500"
                }}>
                  {member.role}
                </p>

                {/* BIO */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    color: "#bbb",
                    fontSize: "13.5px",
                    lineHeight: "1.6",
                    marginTop: "8px"
                  }}
                >
                  {member.bio}
                </motion.p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* CONTACT */}
      <div style={{
        padding: "80px 20px",
        background: "#0b0b0b",
        position: "relative",
        zIndex: 10
      }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(26px, 5vw, 40px)"
        }}>
          Contact Our Garage
        </h2>

        <p style={{
          textAlign: "center",
          color: "#aaa",
          marginBottom: "40px"
        }}>
          Get a quote or book a service today
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you! We will contact you soon.");
          }}
          style={{
            maxWidth: "400px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}
        >
          <input
            type="text"
            placeholder="Your Name"
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "none"
            }}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "none"
            }}
          />

          <textarea
            placeholder="Your Message"
            rows="4"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "none"
            }}
          />

          <button
            type="submit"
            style={{
              padding: "14px",
              background: "#ff2c2c",
              color: "white",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer"
            }}
          >
            Send Message
          </button>
        </form>
      </div>

      {/* CTA */}
      <div style={{
        padding: "60px 20px",
        background: "#111",
        textAlign: "center",
        position: "relative",
        zIndex: 10
      }}>
        <h2 style={{ fontSize: "clamp(24px, 5vw, 36px)" }}>
          Upgrade Your Ride Today
        </h2>

        <button style={{
          marginTop: "20px",
          padding: "14px 36px",
          background: "#ff2c2c",
          border: "none",
          borderRadius: "30px",
          color: "white",
          cursor: "pointer"
        }}>
          Contact Garage
        </button>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: "25px",
        textAlign: "center",
        color: "#666",
        fontSize: "13px",
        position: "relative",
        zIndex: 10
      }}>
        © 2026 Engineered
      </div>

      {/* WHATSAPP FLOATING BUTTON */}
      <a
        href="https://wa.me/919958529564"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#25D366",
          color: "white",
          padding: "15px 18px",
          borderRadius: "50%",
          fontSize: "20px",
          textDecoration: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          zIndex: 1000
        }}
      >
        💬
      </a>
    </div>
  );
}