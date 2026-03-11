import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  Input,
  Badge,
  Tag,
  Checkbox,
  CheckboxGroup,
  Dropdown,
  Select,
  Tabs,
  Rating,
  StarRating,
  type DropdownItem,
} from '../components/shared';

export const ComponentsDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    agree: false,
  });
  const [rating, setRating] = useState(0);

  const handleDropdownSelect = (item: DropdownItem) => {
    console.log('Selected:', item);
  };

  const tabs = [
    {
      id: 'tab1',
      label: 'Components',
      icon: '📦',
      content: (
        <div style={{ padding: '1rem' }}>
          <p>This tabs component is fully functional with keyboard navigation support.</p>
        </div>
      ),
    },
    {
      id: 'tab2',
      label: 'Features',
      icon: '✨',
      content: (
        <div style={{ padding: '1rem' }}>
          <ul>
            <li>TypeScript support</li>
            <li>CSS Modules styling</li>
            <li>Accessible (WCAG)</li>
            <li>Responsive design</li>
            <li>Dark mode ready</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'tab3',
      label: 'Usage',
      icon: '💡',
      content: (
        <div style={{ padding: '1rem' }}>
          <code>
            {`import { Button, Card, Modal } from '@/components/shared';\n\nconst MyComponent = () => (\n  <Button variant="primary">Click me</Button>\n);`}
          </code>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🎨 Component Library Demo</h1>
      <p style={{ color: '#6C6C6C', marginBottom: '2rem' }}>
        All shared UI components for Phase 2-7 implementation
      </p>

      {/* Buttons Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Buttons</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      {/* Cards Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <Card hover shadow="md">
            <CardHeader>Card Header</CardHeader>
            <CardBody>
              <p>This is a card component with hover effect and customizable shadow.</p>
            </CardBody>
            <CardFooter>
              <Button variant="primary" size="sm">
                Action
              </Button>
            </CardFooter>
          </Card>

          <Card shadow="lg" padding="lg">
            <CardBody>
              <h3 style={{ marginTop: 0 }}>Large Card</h3>
              <p>With large padding and shadow effect</p>
            </CardBody>
          </Card>

          <Card hover onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
            <CardBody style={{ textAlign: 'center', padding: '2rem' }}>
              <p>📱 Click to open modal</p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Modal Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Modal</h2>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Open Modal
        </Button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Component Library Modal"
          size="md"
        >
          <p>This is a modal component with backdrop click and escape key support.</p>
          <p>It automatically handles focus management and scrolling.</p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Confirm
            </Button>
          </div>
        </Modal>
      </section>

      {/* Input Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Input Fields</h2>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            helperText="Enter your full name"
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formData.email && !formData.email.includes('@') ? 'Invalid email' : undefined}
          />
          <Input label="Disabled Input" disabled placeholder="Disabled" />
        </div>
      </section>

      {/* Select Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Select & Dropdown</h2>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px', marginBottom: '2rem' }}>
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: '', label: 'Select a category' },
              { value: 'web', label: 'Web Development' },
              { value: 'mobile', label: 'Mobile Development' },
              { value: 'data', label: 'Data Science' },
              { value: 'ai', label: 'AI & Machine Learning' },
            ]}
          />
        </div>

        <h3>Dropdown Menu</h3>
        <Dropdown
          trigger={<Button variant="secondary">Open Menu ▼</Button>}
          items={[
            { value: '1', label: '🏠 Home', icon: '🏠' },
            { value: '2', label: '⚙️ Settings', icon: '⚙️' },
            { value: '3', label: '👤 Profile', icon: '👤' },
            { value: '4', label: '🚪 Logout', icon: '🚪' },
          ]}
          onSelect={handleDropdownSelect}
        />
      </section>

      {/* Badges Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Badges & Tags</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3>Removable Tags</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {selectedTags.map((tag) => (
              <Tag
                key={tag}
                variant="secondary"
                rounded
                onRemove={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
              >
                {tag}
              </Tag>
            ))}
          </div>
          <Button
            size="sm"
            variant="ghost"
            style={{ marginTop: '1rem' }}
            onClick={() => setSelectedTags([...selectedTags, `Tag ${selectedTags.length + 1}`])}
          >
            + Add Tag
          </Button>
        </div>
      </section>

      {/* Checkbox Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Checkboxes</h2>
        <Checkbox
          label="I agree to terms and conditions"
          checked={formData.agree}
          onChange={(e) => setFormData({ ...formData, agree: e.currentTarget.checked })}
        />

        <h3 style={{ marginTop: '1rem' }}>Checkbox Group</h3>
        <CheckboxGroup
          label="Select your interests"
          options={[
            { value: 'web', label: 'Web Development' },
            { value: 'mobile', label: 'Mobile Development' },
            { value: 'data', label: 'Data Science' },
            { value: 'ai', label: 'AI & ML', disabled: false },
          ]}
        />
      </section>

      {/* Rating Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Rating</h2>
        <div>
          <h3>Interactive Rating</h3>
          <Rating value={rating} onChange={setRating} size="lg" showText />
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Static Star Ratings</h3>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <StarRating rating={5} count={122} />
              <p style={{ fontSize: '0.875rem', color: '#6C6C6C', margin: '0.5rem 0 0 0' }}>
                Course Rating
              </p>
            </div>
            <div>
              <StarRating rating={3.5} count={45} />
              <p style={{ fontSize: '0.875rem', color: '#6C6C6C', margin: '0.5rem 0 0 0' }}>
                Product Rating
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Tabs</h2>
        <Tabs tabs={tabs} variant="default" />

        <h3 style={{ marginTop: '2rem' }}>Pill Tabs</h3>
        <Tabs
          tabs={tabs.map((t) => ({ ...t, icon: undefined }))}
          variant="pills"
        />
      </section>

      {/* Typography Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Typography & Spacing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <Card>
            <CardBody>
              <h1 style={{ margin: 0, fontSize: 'var(--text-4xl)' }}>Heading 1</h1>
              <p style={{ color: '#6C6C6C', fontSize: 'var(--text-sm)' }}>XL - 36px</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h2 style={{ margin: 0, fontSize: 'var(--text-3xl)' }}>Heading 2</h2>
              <p style={{ color: '#6C6C6C', fontSize: 'var(--text-sm)' }}>LG - 30px</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 style={{ margin: 0, fontSize: 'var(--text-2xl)' }}>Heading 3</h3>
              <p style={{ color: '#6C6C6C', fontSize: 'var(--text-sm)' }}>MD - 24px</p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
        <p style={{ color: '#6C6C6C', marginBottom: '1rem' }}>
          ✅ Phase 2 Components Complete - Ready for Phase 3: Authentication
        </p>
        <p style={{ color: '#6C6C6C', fontSize: 'var(--text-sm)' }}>
          All components are TypeScript-safe, accessible, and fully responsive.
        </p>
      </div>
    </div>
  );
};
