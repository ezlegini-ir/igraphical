import MainSlidersForm from "@/components/forms/announcement/MainSlidersForm";
import PanelSlidersForm from "@/components/forms/announcement/PanelSlidersForm";
import { database } from "@igraph/database";

const page = async () => {
  const mainSliders = await database.slider.findMany({
    where: {
      type: "MAIN",
    },
    include: {
      image: true,
    },
  });
  const panelSliders = await database.slider.findMany({
    where: {
      type: "PANEL",
    },
    include: {
      image: true,
    },
  });

  return (
    <div className="flex justify-between gap-6">
      <MainSlidersForm sliders={mainSliders} />
      <PanelSlidersForm sliders={panelSliders} />
    </div>
  );
};

export default page;
