import { motion } from 'framer-motion';

function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-3">
          Our Story
        </p>
        <h1 className="font-body text-4xl text-ink mb-8">About Weavind</h1>

        <div className="space-y-5 text-ink/70 leading-relaxed">
          <p>
            Weavind was founded on a simple idea: clothing rooted in Indian craft, made for how people live and dress today, anywhere in the world.
          </p>
          <p>
            Our name comes from "weave" and "India" — a nod to a textile heritage that spans thousands of years, from indigo dye pits to hand looms, reimagined for a modern wardrobe.
          </p>
          <p>
            Every piece we make is designed with care, produced responsibly, and priced honestly. We believe good clothing shouldn't need a compromise between quality, ethics, and affordability.
          </p>
          <p>
            Thank you for being part of our journey.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default About;