/* =========================================================================
   YOUR CONTENT — THIS IS THE ONLY FILE YOU NEED TO EDIT TO ADD VIDEOS
   =========================================================================

   HOW TO ADD A NEW ANIMATION:
   1. Open your video on YouTube.
   2. Copy the ID from the URL.
        https://www.youtube.com/watch?v=dQw4w9WgXcQ   ->  dQw4w9WgXcQ
        https://youtu.be/dQw4w9WgXcQ                  ->  dQw4w9WgXcQ
   3. Copy one { ... } block below, paste it at the top of the list,
      and fill in your own title, category, year and youtube id.
   4. Save the file and refresh the page. Done.

   - Set "featured: true" on ONE project to make it the big hero video
     at the top of the page.
   - Thumbnails are pulled from YouTube automatically. You can override
     one by adding   thumb: "assets/my-image.jpg"
   ========================================================================= */

const SITE = {
  studioName: "Studio Nib",      // your name / studio name (shown top-left)
  tagline: "Animated Stories & Visual Worlds",
  heroHeadline: "We tell stories\nframe by frame.",
  email: "studionibanime@gmail.com",
  // Contact-form delivery. Get a free key at https://web3forms.com
  // (enter the inbox you want messages sent to; they email you a key).
  // Until you paste a real key here, the form will not send.
  formAccessKey: "c084043c-2871-45f2-97e1-1f685a14ab90",
  socials: {
    youtube: "https://www.youtube.com/@StudioNibAnime",
    instagram: "https://instagram.com/yourhandle",
    vimeo: "",
  },
  about:
    "I'm an independent animator crafting short films and visual stories. " +
    "Every project below is a world built from scratch — character, mood, " +
    "motion and music. Pull up a chair and press play.",
};

// No films published yet — the site shows a "first films coming soon" state.
// When you upload your first video to YouTube, remove the // in front of each
// line in the example block below, fill in your real details, and save.
// (Set featured: true on the one you want as the big hero video at the top.)
const PROJECTS = [
  // {
  //   title: "My First Film",
  //   category: "Short Film",
  //   year: "2026",
  //   youtubeId: "PASTE_YOUR_YOUTUBE_ID_HERE",   // the part after watch?v=
  //   description:
  //     "A line or two about the film. This shows under the video when " +
  //     "someone clicks to play it.",
  //   featured: true,                            // big hero video at the top
  // },
];
