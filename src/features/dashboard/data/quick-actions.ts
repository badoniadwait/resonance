export interface QuickActions {
  title: string;
  description: string;
  gradient: string;
  href: string;
}

export const quickActions: QuickActions[] = [
  {
    title: "Narrate a Story",
    description: "Bring a magical adventure to life",
    gradient: "from-cyan-500 to-sky-100",
    href: "/text-to-speech?=Once upon a time, deep inside an enchanted forest surrounded by towering trees and sparkling rivers, there lived a curious little fox who dreamed of exploring the world beyond the woods. Every sunrise brought a new adventure, and every sunset reminded the fox that courage and kindness could turn even the smallest journey into an unforgettable story filled with friendship, wonder, and hope."
  },
  {
    title: "Podcast Introduction",
    description: "Create a professional podcast opening",
    gradient: "from-violet-500 to-fuchsia-100",
    href: "/text-to-speech?=Welcome to another exciting episode of our podcast, where we explore inspiring stories, emerging technologies, and practical insights that help you grow both personally and professionally. Grab your favorite drink, sit back, and join us as we dive into today's fascinating conversation with experts and creators from around the world."
  },
  {
    title: "Product Advertisement",
    description: "Generate a compelling promotional voice",
    gradient: "from-emerald-500 to-lime-100",
    href: "/text-to-speech?=Introducing the future of smart living, a product designed to make your everyday life simpler, faster, and more enjoyable. With premium quality, innovative features, and a sleek modern design, it's built to exceed your expectations. Experience unmatched performance and discover why thousands of customers are making the switch today."
  },
  {
    title: "Motivational Speech",
    description: "Inspire and energize your audience",
    gradient: "from-orange-500 to-amber-100",
    href: "/text-to-speech?=Success is not determined by how many times you avoid failure, but by how many times you choose to rise after falling. Every challenge you face is an opportunity to become stronger, wiser, and more resilient. Believe in your abilities, trust the process, and remember that your greatest achievements begin with the decision to never give up."
  },
  {
    title: "YouTube Voiceover",
    description: "Create engaging narration for videos",
    gradient: "from-rose-500 to-pink-100",
    href: "/text-to-speech?=Welcome back to the channel! In today's video, we're taking a closer look at an incredible topic that has been requested by many of you. We'll break everything down into simple steps, share practical tips along the way, and make sure you leave with valuable knowledge that you can apply immediately. Let's get started."
  },
  {
    title: "Guided Meditation",
    description: "Generate a calm and relaxing voice",
    gradient: "from-indigo-500 to-blue-100",
    href: "/text-to-speech?=Find a comfortable position and gently close your eyes. Take a slow, deep breath in through your nose, and slowly exhale through your mouth. Allow your shoulders to relax, your thoughts to settle, and your body to become lighter with every breath. Focus only on the present moment, embracing a sense of peace, gratitude, and inner calm as you continue to breathe naturally."
  }
];