import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link className="nav-link" href={href}>
            {label}
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-expand-lg bg-light">
    <div className="container-fluid">
      <a className="navbar-brand" href="/">Ticket</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="">Home</a>
          </li>
        </ul>
        {currentUser ? 
            <div className="d-flex justify-content-center">
            <text className="nav d-flex align-items-center">Hello! {currentUser.name}</text> 
            <img src={currentUser.picture} class="rounded-circle"
                height="35" alt="Avatar" loading="lazy" />
            </div>
        : <text className="nav d-flex align-items-center"></text> }
        
          <div className="d-flex justify-content-end">
            <ul className="nav d-flex align-items-center">{links}</ul>
            </div>
          </div>
      </div>
  </nav>
  );
};
