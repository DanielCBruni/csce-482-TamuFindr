import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <Link href="/home">Home</Link>
      <Link href="/report">Report</Link>
      <Link href="/activity">Activity</Link>
      <Link href="/helpt">Help</Link>
    </header>
  );
}
