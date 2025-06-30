import { DecoratorNode } from "lexical";
import { JSX } from "react";
import CourseBanner from "@igraph/ui/components/CourseBanner";

export class CourseBannerNode extends DecoratorNode<JSX.Element> {
  __courseId: string;

  static getType() {
    return "course-banner";
  }

  static clone(node: CourseBannerNode) {
    return new CourseBannerNode(node.__courseId, node.__key);
  }

  constructor(courseId: string, key?: string) {
    super(key);
    this.__courseId = courseId;
  }

  createDOM(): HTMLElement {
    return document.createElement("div");
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return <CourseBanner courseId={this.__courseId} />;
  }

  exportJSON(): any {
    return {
      type: "course-banner",
      version: 1,
      courseId: this.__courseId,
    };
  }

  static importJSON(serializedNode: any): CourseBannerNode {
    return new CourseBannerNode(serializedNode.courseId);
  }

  static importDOM(): any {
    return {
      // هنگام لود HTML از DOM اگه بخوای پشتیبانی بدی
    };
  }

  isInline(): boolean {
    return false;
  }
}

export function $createCourseBannerNode(courseId: string) {
  return new CourseBannerNode(courseId);
}
