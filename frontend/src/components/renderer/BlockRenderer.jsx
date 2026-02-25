import HeroBlock          from "./blocks/HeroBlock";
import TextBlock          from "./blocks/TextBlock";
import ImageBlock         from "./blocks/ImageBlock";
import VideoBlock         from "./blocks/VideoBlock";
import CountdownBlock     from "./blocks/CountdownBlock";
import CtaBannerBlock     from "./blocks/CtaBannerBlock";
import GalleryBlock       from "./blocks/GalleryBlock";
import FeaturesBlock      from "./blocks/FeaturesBlock";
import ProductsBlock      from "./blocks/ProductsBlock";
import SpacerBlock        from "./blocks/SpacerBlock";
import TestimonialsBlock  from "./blocks/TestimonialsBlock";
import ColumnsBlock       from "./blocks/ColumnsBlock";
import "./renderer.css";

const BLOCK_COMPONENTS = {
  hero:         HeroBlock,
  text:         TextBlock,
  image:        ImageBlock,
  video:        VideoBlock,
  countdown:    CountdownBlock,
  cta_banner:   CtaBannerBlock,
  gallery:      GalleryBlock,
  features:     FeaturesBlock,
  products:     ProductsBlock,
  spacer:       SpacerBlock,
  testimonials: TestimonialsBlock,
  columns:      ColumnsBlock,
};

export default function BlockRenderer({ block, products = [], isNested = false }) {
  const Component = BLOCK_COMPONENTS[block.type];
  if (!Component) return null;
  return <Component block={block} products={products} isNested={isNested} />;
}
