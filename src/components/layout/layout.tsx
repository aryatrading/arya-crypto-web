type LayoutPropsType = { children: any };

export default function Layout({ children }: LayoutPropsType) {
  return <div className="h-full w-full container">{children}</div>;
}
