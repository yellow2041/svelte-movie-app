import Home from "@/routes/Home.svelte";
import About from "@/routes/About.svelte";
import Movie from "@/routes/Movie.svelte";
import NotFound from "@/routes/NotFound.svelte";

export default {
  "/": Home,
  "/movie/:id": Movie,
  "/about": About,
  "*": NotFound,
};
