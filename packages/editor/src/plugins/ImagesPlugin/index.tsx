import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  getDOMSelectionFromTarget,
  isHTMLElement,
  LexicalCommand,
  LexicalEditor,
} from "lexical";
import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";

import { Image as ImageType } from "@igraph/database";
import Loader from "@igraph/ui/components/Loader";
import { Button as UiButton } from "@igraph/ui/components/ui/button";
import { Separator } from "@igraph/ui/components/ui/separator";
import { createPostAssetImage, deleteImage, useLoading } from "@igraph/utils";
import { Frown, Link, Plus, Trash, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getAllAssetImages, getAllAssetImagesCount } from "../../data/image";
import {
  $createImageNode,
  $isImageNode,
  ImageNode,
  ImagePayload,
} from "../../nodes/ImageNode";
import Button from "../../ui/Button";
import { DialogActions, DialogButtonsList } from "../../ui/Dialog";
import FileInput from "../../ui/FileInput";
import TextInput from "../../ui/TextInput";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");

export function InsertImageUriDialogBody({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");

  const isDisabled = src === "";

  return (
    <>
      <TextInput
        label="Image URL"
        placeholder="i.e. https://source.unsplash.com/random"
        onChange={setSrc}
        value={src}
        data-test-id="image-modal-url-input"
      />
      <TextInput
        label="Alt Text"
        placeholder="Random unsplash image"
        onChange={setAltText}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <DialogActions>
        <Button
          data-test-id="image-modal-confirm-btn"
          disabled={isDisabled}
          onClick={() => onClick({ altText, src })}
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}

export function InsertImageUploadedDialogBody({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");
  const { loading, setLoading } = useLoading();

  const isDisabled = src === "";

  const loadImage = (files: FileList | null) => {
    setLoading(true);
    setSrc("");

    const reader = new FileReader();
    reader.onload = async function () {
      if (typeof reader.result === "string") {
        setSrc(reader.result);
        setLoading(true);

        if (files !== null) {
          const res = await createPostAssetImage(files[0], {
            folder: "asset",
            resource_type: "image",
            width: 800,
          });
          if (res.url) {
            setLoading(false);
            toast.success("Image Uploaded");
            setSrc(res.url);
          }
        }
      }

      setLoading(false);
      return "";
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <>
      <div className="mb-3 flex flex-col gap-3 justify-center relative">
        <label htmlFor="image-upload">
          <Image
            alt=""
            src={src || "/placeholder.svg"}
            width={350}
            height={350}
            className="rounded-sm border-[1px] border-slate-400 hover:drop-shadow-md border-dashed  cursor-pointer relative "
          />
        </label>
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center gap-2 bg-white/30 p-1 px-2 rounded-sm text-sm">
            <Loader loading />
          </div>
        )}
      </div>

      <div className="hidden">
        <FileInput
          id="image-upload"
          label="Image Upload"
          onChange={loadImage}
          accept="image/*"
          data-test-id="image-modal-file-upload"
        />
      </div>
      <TextInput
        label=""
        placeholder="Alternative Text"
        onChange={setAltText}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <DialogActions>
        <UiButton
          variant={"lightBlue"}
          data-test-id="image-modal-file-upload-btn"
          disabled={isDisabled || loading}
          onClick={() => onClick({ altText, src })}
          className="w-full"
        >
          Insert
        </UiButton>
      </DialogActions>
    </>
  );
}

export function InsertImageDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [mode, setMode] = useState<null | "url" | "file">(null);
  const hasModifier = useRef(false);

  useEffect(() => {
    hasModifier.current = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [activeEditor]);

  const onClick = async (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    onClose();
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const postImageSize = 32;
  const load = searchParams.get("load") || postImageSize;

  const handleLoadImage = () => {
    const loadImages = Number(load) + postImageSize;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("load", loadImages.toString());
    router.push(`?${newParams.toString()}`);
  };

  const loadImages = searchParams.get("load");
  const take = loadImages ? +loadImages : postImageSize;

  const [images, setImages] = useState<ImageType[]>([]);
  const [imagesCount, setImagesCount] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      const fetchedImages = await getAllAssetImages({ take });
      const imagesCount = await getAllAssetImagesCount();
      setImages(fetchedImages);
      setImagesCount(imagesCount);
    };

    fetchImages();
  }, [take]);

  const { loading, setLoading } = useLoading();

  const handleDeleteImage = async (publicId: string) => {
    setLoading(true);

    try {
      await deleteImage(publicId); // Delete from DB & Cloud

      // Update images state by removing the deleted image
      setImages((prevImages) =>
        prevImages.filter((img) => img.public_id !== publicId)
      );
      setLoading(false);
    } catch (error) {
      console.error("Failed to delete image:", error);
      setLoading(false);
    }
  };

  return (
    <>
      {!mode && (
        <>
          <DialogButtonsList>
            <div className="flex gap-3">
              {/* <Button
                data-test-id="image-modal-option-sample"
                onClick={() =>
                  onClick(
                    hasModifier.current
                      ? {
                          altText:
                            "Daylight fir trees forest glacier green high ice landscape",
                          src: profile,
                        }
                      : {
                          altText: "Yellow flower in tilt shift lens",
                          src: igraphLogo,
                        }
                  )
                }
              >
                Logo
              </Button> */}

              <UiButton
                variant={"secondary"}
                data-test-id="image-modal-option-url"
                onClick={() => setMode("url")}
              >
                <Link />
                From URL
              </UiButton>

              <UiButton
                data-test-id="image-modal-option-file"
                onClick={() => setMode("file")}
              >
                <Upload />
                Upload
              </UiButton>
            </div>
          </DialogButtonsList>

          <Separator className="mb-6" />

          <div className="flex flex-col items-center gap-5">
            <div className="w-screen  max-w-screen-xl grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {images.length < 1 && (
                <div className="py-10 text-gray-400 flex items-center justify-center gap-3 flex-col text-center col-span-8">
                  <div>
                    <Frown strokeWidth={1.4} size={120} />
                  </div>
                  <span>No Image Uploaded</span>
                </div>
              )}
              {images.map((img, index) => (
                <div
                  key={img.id}
                  className="relative rounded-sm overflow-hidden group"
                >
                  <Image
                    alt=""
                    src={img.url}
                    width={150}
                    height={150}
                    className="aspect-square object-cover rounded-sm"
                  />

                  <div className="absolute bottom-0  justify-center items-center gap-3 w-full h-full hidden group-hover:flex bg-black/20">
                    <UiButton
                      disabled={loading}
                      variant={"default"}
                      size={"icon"}
                      onClick={() => onClick({ altText: "", src: img.url })}
                    >
                      <Plus />
                    </UiButton>
                    <UiButton
                      onClick={() => handleDeleteImage(img.public_id)}
                      variant={"destructive"}
                      size={"icon"}
                      disabled={loading}
                    >
                      {!loading && <Trash />}
                      <Loader loading={loading} />
                    </UiButton>
                  </div>
                </div>
              ))}
            </div>

            {postImageSize < imagesCount && (
              <UiButton
                size={"sm"}
                className="w-min px-5"
                variant={"lightBlue"}
                onClick={handleLoadImage}
                disabled={+load >= imagesCount}
              >
                Load More
              </UiButton>
            )}
          </div>
        </>
      )}

      {mode === "url" && <InsertImageUriDialogBody onClick={onClick} />}
      {mode === "file" && <InsertImageUploadedDialogBody onClick={onClick} />}
    </>
  );
}

export default function ImagesPlugin({
  captionsEnabled,
}: {
  captionsEnabled?: boolean;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => {
          return $onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => {
          return $onDragover(event);
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => {
          return $onDrop(event, editor);
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [captionsEnabled, editor]);

  return null;
}

const TRANSPARENT_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
let img: HTMLImageElement | undefined;
if (typeof document !== "undefined") {
  img = document.createElement("img");
  img.src = TRANSPARENT_IMAGE;
}

function $onDragStart(event: DragEvent): boolean {
  const node = $getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return false;
  }
  dataTransfer.setData("text/plain", "_");
  dataTransfer.setDragImage(img!, 0, 0);
  dataTransfer.setData(
    "application/x-lexical-drag",
    JSON.stringify({
      data: {
        altText: node.__altText,
        caption: node.__caption,
        height: node.__height,
        key: node.getKey(),
        maxWidth: node.__maxWidth,
        showCaption: node.__showCaption,
        src: node.__src,
        width: node.__width,
      },
      type: "image",
    })
  );

  return true;
}

function $onDragover(event: DragEvent): boolean {
  const node = $getImageNodeInSelection();
  if (!node) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}

function $onDrop(event: DragEvent, editor: LexicalEditor): boolean {
  const node = $getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const data = getDragImageData(event);
  if (!data) {
    return false;
  }
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
  }
  return true;
}

function $getImageNodeInSelection(): ImageNode | null {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
}

function getDragImageData(event: DragEvent): null | InsertImagePayload {
  const dragData = event.dataTransfer?.getData("application/x-lexical-drag");
  if (!dragData) {
    return null;
  }
  const { type, data } = JSON.parse(dragData);
  if (type !== "image") {
    return null;
  }

  return data;
}

declare global {
  interface DragEvent {
    rangeOffset?: number;
    rangeParent?: Node;
  }
}

function canDropImage(event: DragEvent): boolean {
  const target = event.target;
  return !!(
    isHTMLElement(target) &&
    !target.closest("code, span.editor-image") &&
    isHTMLElement(target.parentElement) &&
    target.parentElement.closest("div.ContentEditable__root")
  );
}

function getDragSelection(event: DragEvent): Range | null | undefined {
  let range;
  const domSelection = getDOMSelectionFromTarget(event.target);
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
    range = domSelection.getRangeAt(0);
  } else {
    throw Error(`Cannot get the selection when dragging`);
  }

  return range;
}
