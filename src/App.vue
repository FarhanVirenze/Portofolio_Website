<template>
  <!-- component -->
  <div class="max-w-7xl mx-auto flex flex-col relative">

    <nav class="max-w-7xl px-5 md:fixed top-0 z-[98] w-screen backdrop-blur-md bg-[#121212] bg-opacity-80">
      <div class="container mx-auto flex flex-wrap items-center justify-between">
        <button @click="redirectToHome; playSound()" class="flex">
          <span class="self-center text-lg text-[#ffdb70] font-semibold whitespace-nowrap fadein-bot hover:text-amber-100">MuhamadFarhan();</span>
        </button>
        <div class="flex md:order-2 fadein-bot">
          <!-- Added @click="playSound" to the GitHub button -->
          <a href="https://github.com/FarhanVirenze" @click="playSound">
            <img class="w-9 rounded-full" src="https://seeklogo.com/images/G/github-logo-2E3852456C-seeklogo.com.png" alt="github">
          </a>
        </div>
        <div class="hidden md:flex justify-between items-center w-full md:w-auto md:order-1" id="mobile-menu-3">
          <ul class="flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium">
            <li>
              <router-link to="/" @click="playSound"
                class="fadein-bot text-gray-700 hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-gray-500 md:p-0"
                aria-current="page">Home</router-link>
            </li>
            <li>
              <router-link to="/about" @click="playSound"
                class="fadein-bot fadein-1 text-gray-700 hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-gray-500 md:p-0">About</router-link>
            </li>
            <li>
              <router-link to="/portofolio" @click="playSound"
                class="fadein-bot fadein-2 text-gray-700 hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-gray-500 md:p-0">Portofolio</router-link>
            </li>
            <li>
              <router-link to="/certification" @click="playSound"
                class="fadein-bot fadein-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-gray-500 md:p-0 blog">Certification</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="md:mt-[100px]">
      <router-view />
    </div>
  </div>

  <!-- Footer Section (Mobile View) -->
  <footer class="block md:hidden fixed bottom-0 left-0 right-0 rounded-t-3xl border border-[#383838] bg-[#121212] bg-opacity-80 backdrop-blur-md backdrop-opacity-90">
    <nav class="flex justify-around py-4 text-xs">
      <router-link to="/" @click="playSound" class="text-gray-300 hover:text-white">Home</router-link>
      <router-link to="/about" @click="playSound" class="text-gray-300 hover:text-white">About</router-link>
      <router-link to="/portofolio" @click="playSound" class="text-gray-300 hover:text-white">Portofolio</router-link>
      <router-link to="/certification" @click="playSound" class="text-gray-300 hover:text-white">Certification</router-link>
    </nav>
  </footer>

  <footer class="text-white text-center mt-8 mb-16 px-6">
  <div class="mb-3">
    <h2 class="text-lg md:text-xl font-semibold mb-3 text-amber-200">Reach me out</h2>
    <div class="flex justify-center gap-5 md:gap-6 text-lg md:text-2xl">
      <a href="mailto:farhanvirenze18@gmail.com" target="_blank" class="text-gray-300 hover:text-green-400 transition-colors">
        <i class="fas fa-envelope"></i>
      </a>
      <a href="https://www.instagram.com/xffarhans?igsh=MWdqMnJibHJmb2FkZg==" target="_blank" class="text-gray-300 hover:text-pink-400 transition-colors">
        <i class="fab fa-instagram"></i>
      </a>
      <a href="https://www.tiktok.com/@farhans18_?_t=ZS-8vovM9laCg4&_r=1" target="_blank" class="text-gray-300 hover:text-red-400 transition-colors">
        <i class="fab fa-tiktok"></i>
      </a>
      <a href="https://www.linkedin.com/in/muhamadfrhn" target="_blank" class="text-gray-300 hover:text-blue-400 transition-colors">
        <i class="fab fa-linkedin"></i>
      </a>
    </div>
  </div>
  <div class="text-xs md:text-sm text-gray-400 mt-2 font-medium">
    © Muhamad Farhan 2025 • Got any feedback?
  </div>
</footer>

</template>

<script>
export default {
  methods: {
    redirectToHome() {
      this.$router.push('/');
    },
    playSound() {
      const audio = new Audio('/assets/pop.mp3');  // Path to the sound file
      audio.play();  // Play the sound when the function is triggered
    }
  },
}
</script>

<style>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 5px; /* for vertical scrollbar */
  height: 5px; /* for horizontal scrollbar */
}

::-webkit-scrollbar-track {
  background: hsl(240, 1%, 17%);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: #ffdb70;
  border-radius: 5px;
}

::-webkit-scrollbar-button { width: 20px; }

body {
  font-family: 'Poppins', sans-serif;
  background: hsl(0, 0%, 7%);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  transition: color 0.3s;
}

nav a.router-link-exact-active {
  display: inline-flex;
  flex-direction: column;
  color: white;
  transition: color 0.3s;
}

nav a.router-link-exact-active::after {
  display: inline-block;
  content: "";
  margin-top: 0.08em;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background-color: #ffdb70;
}

nav a.router-link-exact-active:hover {
  color: white;
}

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
