import Link from "next/link";
import Image from "next/image";
import { GitPullRequest, Hash, Link2, MessageSquare } from "lucide-react";

export function Footer() {
  return (
    <footer id="resources" className="footer-dark mt-0 text-white">
      <div className="container-draftly py-11">
        <div className="grid gap-10 md:grid-cols-[1.55fr_0.75fr_0.75fr_0.75fr_1.45fr]">
          <div>
            <Link
              href="/"
              className="flex items-center text-2xl font-extrabold tracking-[-0.05em]">
              <Image
                src="/draftly-no-bg-logo.svg"
                alt=""
                aria-hidden="true"
                width={36}
                height={36}
                className="size-8 shrink-0 object-contain"
              />
              raftly
            </Link>

            <p className="mt-6 max-w-[250px] text-sm font-medium leading-6 text-white/72">
              The documentation engineering platform for modern software teams.
            </p>

            <div className="mt-7 flex gap-4 text-white">
              <GitPullRequest className="size-5" />
              <Hash className="size-5" />
              <MessageSquare className="size-5" />
              <Link2 className="size-5" />
            </div>

            <p className="mt-8 text-xs text-white/55">
              © 2025 Draftly, Inc. All rights reserved.
            </p>
          </div>

          <FooterColumn
            title="Product"
            links={[
              ["How it works", "#how-it-works"],
              ["Workflows", "#product"],
              ["Agents", "#product"],
              ["Knowledge", "#product"],
              ["Evaluations", "#product"],
            ]}
          />

          <FooterColumn
            title="Resources"
            links={[
              ["Documentation", "/docs"],
              ["Blog", "#"],
              ["Changelog", "#"],
              ["Help Center", "#"],
              ["Status", "#"],
            ]}
          />

          <FooterColumn
            title="Company"
            links={[
              ["About", "#"],
              ["Careers", "#"],
              ["Contact", "#"],
              ["Privacy", "#"],
              ["Terms", "#"],
            ]}
          />

          <div>
            <h3 className="text-sm font-extrabold">Stay in the loop</h3>
            <p className="mt-5 text-sm font-medium leading-6 text-white/72">
              Get product updates and best practices for documentation
              engineering.
            </p>
            <form className="mt-6 flex gap-3">
              <label htmlFor="footer-email" className="sr-only">
                Email
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                className="h-12 min-w-0 flex-1 rounded-[7px] border border-white/15 bg-white px-4 text-sm font-medium text-foreground outline-none placeholder:text-muted focus:border-primary"
              />
              <button className="h-12 rounded-[7px] bg-primary px-5 text-sm font-extrabold text-white">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h3 className="text-sm font-extrabold">{title}</h3>

      <ul className="mt-5 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="text-sm font-medium text-white/72 transition hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
