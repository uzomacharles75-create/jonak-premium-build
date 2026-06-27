import aboutLogoClear from "@/assets/site/about-logo-clear.jpg";
import aboutGate from "@/assets/site/about-gate.jpg";
import heroGate from "@/assets/site/project-estate-gate-lion.jpg";
import projectCraneHighrise from "@/assets/site/project-crane-highrise.jpg";
import projectArchScaffold from "@/assets/site/project-arch-scaffold.jpg";
import projectModernGatePanel from "@/assets/site/project-modern-gate-panel.jpg";
import projectSecurityDoorWoodgrain from "@/assets/site/project-security-door-woodgrain.jpg";
import projectShadeSail from "@/assets/site/project-shade-sail.jpg";
import projectSpiralStaircaseExterior from "@/assets/site/project-spiral-staircase-exterior.jpg";
import projectSpiralStaircaseIndoor from "@/assets/site/project-spiral-staircase-indoor.jpg";
import projectWoodFinishDoors from "@/assets/site/project-wood-finish-doors.jpg";
import showcaseVideo from "@/assets/site/showcase.mp4";
import bridgeWorks from "@/assets/project-bridge.jpg";

const whatsappNumber = "2347052193488";
const whatsappBase = `https://wa.me/${whatsappNumber}`;

export function getWhatsAppLink(message = "Hello Jonak Construction, I would like a quote for my project.") {
  return `${whatsappBase}?text=${encodeURIComponent(message)}`;
}

export function getQuoteLink(subject = "my project") {
  return getWhatsAppLink(
    `Hello Jonak Construction,\n\nI would like a quote for ${subject}.\nPlease contact me with the next steps.`,
  );
}

export const heroMedia = {
  url: heroGate,
  alt: "Matte black estate gate and perimeter wall with a lion crest detail",
  title: "Lion Crest Estate Gate",
  description:
    "Custom steel estate gate and perimeter wall finished in matte black with decorative crest work.",
};

export const aboutMedia = {
  url: aboutLogoClear,
  alt: "Jonak Construction Limited logo on a clearer purple background with gold building icon and company name",
  title: "Jonak Construction Limited Logo",
  description:
    "Jonak Construction Limited brand logo used as the About section image.",
};

export const showcaseMedia = {
  videoUrl: showcaseVideo,
  posterUrl: heroGate,
  title: "Project Showcase Reel",
  description:
    "A short showcase of Jonak Construction work across gates, doors, staircases, canopies, and site fabrication.",
};

export type ProjectCategory = "Buildings" | "Civil Works" | "Doors" | "Gates" | "Staircases";

export type ProjectItem = {
  url: string;
  title: string;
  description: string;
  cat: ProjectCategory;
  span: string;
};

export const projectGallery: ProjectItem[] = [
  {
    url: heroGate,
    title: "Lion Crest Estate Gate",
    description: "Matte black estate gate and wall with decorative lion crest detailing.",
    cat: "Gates",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    url: projectCraneHighrise,
    title: "High-Rise Crane and Tower Works",
    description: "Tower crane working beside an active high-rise building under construction.",
    cat: "Buildings",
    span: "lg:col-span-1 lg:row-span-2",
  },
  {
    url: aboutGate,
    title: "Black Modern Security Gate",
    description: "Custom black steel gate and perimeter wall with clean modern paneling.",
    cat: "Gates",
    span: "lg:col-span-1",
  },
  {
    url: projectArchScaffold,
    title: "Decorative Entrance Arch Framework",
    description: "Entrance arch and site scaffolding for a custom residential frontage.",
    cat: "Buildings",
    span: "lg:col-span-1",
  },
  {
    url: projectSpiralStaircaseIndoor,
    title: "Spiral Staircase With Stainless Railing",
    description: "Indoor spiral staircase with polished stainless balustrade and gold accents.",
    cat: "Staircases",
    span: "lg:col-span-1",
  },
  {
    url: projectSecurityDoorWoodgrain,
    title: "Woodgrain Steel Security Door",
    description: "Fabricated security door with a wood-finish panel and reinforced frame.",
    cat: "Doors",
    span: "lg:col-span-2",
  },
  {
    url: projectModernGatePanel,
    title: "Modern Grey Gate Panel",
    description: "Light grey steel gate panel with geometric trim details.",
    cat: "Gates",
    span: "lg:col-span-1",
  },
  {
    url: projectSpiralStaircaseExterior,
    title: "Exterior Spiral Staircase With Canopy",
    description: "Outdoor spiral staircase installed on a multi-storey home.",
    cat: "Staircases",
    span: "lg:col-span-1",
  },
  {
    url: projectShadeSail,
    title: "Courtyard Shade Canopy",
    description: "Green tension canopy installed over a paved courtyard for shade and comfort.",
    cat: "Buildings",
    span: "lg:col-span-1",
  },
  {
    url: projectWoodFinishDoors,
    title: "Wood-Finish Security Doors",
    description: "Row of custom steel doors finished with warm wood-grain panels.",
    cat: "Doors",
    span: "lg:col-span-1",
  },
  {
    url: bridgeWorks,
    title: "Bridge and Access Road Works",
    description: "Concrete bridge and access road works supporting site circulation.",
    cat: "Civil Works",
    span: "lg:col-span-1",
  },
];
