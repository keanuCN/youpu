import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <p className="mono-label text-primary">404 NOT FOUND</p>
      <h1 className="mt-4 text-[30px] font-medium">页面不存在</h1>
      <p className="mt-3 text-[13.5px] text-muted-foreground">你要找的档案或页面可能已被移动或删除。</p>
      <Link href="/" className="mono-label mt-6 inline-block bg-foreground px-5 py-3 text-background hover:bg-primary">
        回到首页
      </Link>
    </div>
  );
}
