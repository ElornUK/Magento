<?php
namespace P3\PaymentGateway\Model\Config\Source;

class DelayCapture
{
    /**
     * @return array
     */
    public function toOptionArray()
    {
        return [
            ['value' => '0','label' => __('Off')],
            ['value' => '-1','label' => __('Indefinitely')],
            ['value' => '1','label' => __('Automatically in 1 day\'s time')],
            ['value' => '2','label' => __('Automatically in 2 days\' time')],
            ['value' => '3','label' => __('Automatically in 3 days\' time')],
            ['value' => '4','label' => __('Automatically in 4 days\' time')],
            ['value' => '5','label' => __('Automatically in 5 days\' time')],
            ['value' => '6','label' => __('Automatically in 6 days\' time')],
            ['value' => '7','label' => __('Automatically in 7 days\' time')],
            ['value' => '8','label' => __('Automatically in 8 days\' time')],
            ['value' => '9','label' => __('Automatically in 9 days\' time')],
            ['value' => '10','label' => __('Automatically in 10 days\' time')],
            ['value' => '11','label' => __('Automatically in 11 days\' time')],
            ['value' => '12','label' => __('Automatically in 12 days\' time')],
            ['value' => '13','label' => __('Automatically in 13 days\' time')],
            ['value' => '14','label' => __('Automatically in 14 days\' time')],
            ['value' => '15','label' => __('Automatically in 15 days\' time')],
            ['value' => '16','label' => __('Automatically in 16 days\' time')],
            ['value' => '17','label' => __('Automatically in 17 days\' time')],
            ['value' => '18','label' => __('Automatically in 18 days\' time')],
            ['value' => '19','label' => __('Automatically in 19 days\' time')],
            ['value' => '20','label' => __('Automatically in 20 days\' time')],
            ['value' => '21','label' => __('Automatically in 21 days\' time')],
            ['value' => '22','label' => __('Automatically in 22 days\' time')],
            ['value' => '23','label' => __('Automatically in 23 days\' time')],
            ['value' => '24','label' => __('Automatically in 24 days\' time')],
            ['value' => '25','label' => __('Automatically in 25 days\' time')],
            ['value' => '26','label' => __('Automatically in 26 days\' time')],
            ['value' => '27','label' => __('Automatically in 27 days\' time')],
            ['value' => '28','label' => __('Automatically in 28 days\' time')],
            ['value' => '29','label' => __('Automatically in 29 days\' time')],
            ['value' => '30','label' => __('Automatically in 30 days\' time')]
        ];
    }
}